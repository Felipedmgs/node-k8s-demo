# 📌 1. Criar o projeto Node.js

No WSL (Linux):

cd /mnt/e/NODEJS
mkdir node-k8s-demo
cd node-k8s-demo
code .

📁 Estrutura inicial
node-k8s-demo/
 ├─ src/
 │   └─ index.js
 ├─ package.json
 ├─ Dockerfile
 └─ k8s/
     ├─ deployment.yaml
     └─ service.yaml

# 📌 2. Criar o app Node.js
Criar o package.json
npm init -y
npm install express

Criar src/index.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "100", 10);

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Node + Kubernetes 👋",
    batchSize: BATCH_SIZE,
    timestamp: new Date().toISOString()
  });
});

app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, ts: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 App rodando na porta ${PORT} com batchSize=${BATCH_SIZE}`);
});

Ajustar script no package.json
"scripts": {
  "start": "node src/index.js"
}

Testar localmente
npm start


Acesse:

http://localhost:3000

http://localhost:3000/healthz

# 📌 3. Criar Dockerfile

Crie o arquivo Dockerfile na raiz:

FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production || npm install --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

Build da imagem
docker build -t node-k8s-demo:1.0.0 .

Testar o container
docker run --rm -p 3000:3000 \
  -e BATCH_SIZE=200 \
  node-k8s-demo:1.0.0


Acesse novamente no navegador para confirmar.

# 📌 4. Criar o cluster KIND
Verificar se o KIND está instalado
kind --version

Criar o cluster
kind create cluster --name kind

Verificar o node
kubectl get nodes


Esperado:

NAME                STATUS   ROLES           AGE   VERSION
kind-control-plane  Ready    control-plane   Xs    v1.34.0

# 📌 5. Carregar imagem no KIND

Porque o KIND usa um Docker interno:

kind load docker-image node-k8s-demo:1.0.0 --name kind

# 📌 6. Criar manifets Kubernetes

Crie a pasta:

mkdir k8s

📄 k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-k8s-demo
  labels:
    app: node-k8s-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node-k8s-demo
  template:
    metadata:
      labels:
        app: node-k8s-demo
    spec:
      containers:
        - name: node-k8s-demo
          image: node-k8s-demo:1.0.0
          imagePullPolicy: IfNotPresent
          env:
            - name: PORT
              value: "3000"
            - name: BATCH_SIZE
              value: "100"
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          livenessProbe:
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /healthz
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5

📄 k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: node-k8s-demo
spec:
  type: ClusterIP
  selector:
    app: node-k8s-demo
  ports:
    - port: 3000
      targetPort: 3000
      protocol: TCP

# 📌 7. Aplicar no cluster
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml


Verificar:

kubectl get pods
kubectl get svc


Esperado:

node-k8s-demo-XXXXX   1/1   Running

# 📌 8. Acessar o app no Kubernetes (DEV MODE)
kubectl port-forward svc/node-k8s-demo 3000:3000


Abra no navegador:

http://localhost:3000

http://localhost:3000/healthz

# 📌 9. Fazer alterações e rollout
✔ Alterar variável de ambiente
kubectl set env deployment/node-k8s-demo BATCH_SIZE=300

✔ Reiniciar rollout
kubectl rollout restart deployment/node-k8s-demo

✔ Ver status
kubectl rollout status deployment/node-k8s-demo

✔ Alterar image (nova versão)
kubectl set image deployment/node-k8s-demo \
  node-k8s-demo=node-k8s-demo:1.0.1

✔ Rollback (voltar versão)
kubectl rollout undo deployment/node-k8s-demo

# 📌 10. Como acessar logs

Do Deployment:

kubectl logs deployment/node-k8s-demo -f


De um Pod específico:

kubectl logs node-k8s-demo-XXXXX -f

# 📌 11. Pronto para Oracle Cloud (OKE + OCIR)

Depois que tudo funciona local:

1. Tag da imagem
docker tag node-k8s-demo:1.0.0 <ocir-registry>/node-k8s-demo:1.0.0

2. Login no OCIR
docker login <ocir-registry>

3. Push
docker push <ocir-registry>/node-k8s-demo:1.0.0

4. Ajustar imagem no deployment.yaml
image: <ocir-registry>/node-k8s-demo:1.0.0

5. Aplicar no cluster OKE
kubectl apply -f k8s/

# 🎉 Conclusão

Você agora tem:

✔ Aplicação Node.js
✔ Dockerfile profissional
✔ Imagem rodando em container
✔ Cluster KIND configurado
✔ Deploy + Service no Kubernetes
✔ Health checks
✔ Port-forward
✔ Rollout restart / rollback
✔ Pronto para enviar para o Oracle Cloud (OKE)

Esse processo é idêntico ao usado em produção em empresas grandes.