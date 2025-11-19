📦 node-k8s-demo

Aplicação Node.js criada para demonstrar conceitos essenciais de containers, variáveis de ambiente, consumo de memória, Kubernetes, deployments, rollouts e práticas de observabilidade.

Este projeto serve como laboratório pessoal para estudar Docker, Kubernetes (kind), Node.js, resource limits, env vars, e simulação de carga dentro de um pod.

🚀 Funcionalidades

Endpoint /healthz para checagem de saúde

Variável de ambiente BATCH_SIZE controlando a carga simulada

Função interna para medir consumo de memória do processo

Loop configurável para simular consumo real de recursos

Dockerfile pronto para build

Manifesto Kubernetes (deployment.yaml)

Suporte a rollout restart e alteração de env em tempo de execução

Teste completo no kind (Kubernetes local)

🧱 Arquitetura
Node.js
 └── Express server
      ├── /healthz (status)
      └── Worker de carga simulada
Docker
 └── Container
Kubernetes
 ├── Deployment
 ├── Pod (1 replica)
 ├── Resources (limits/requests)
 └── Rollout + env update

🔧 Tecnologias

Node.js + Express

Docker

Kubernetes (kind)

YAML de deployment

Variáveis de ambiente

Métricas internas com process.memoryUsage()

Rollout strategies

🛠️ Como rodar localmente
1️⃣ Instale as dependências
npm install

2️⃣ Execute local
npm start

3️⃣ Teste
curl http://localhost:3000/healthz

🐳 Como rodar com Docker
Gerar imagem
docker build -t node-k8s-demo .

Executar
docker run -p 3000:3000 -e BATCH_SIZE=300 node-k8s-demo

☸️ Como rodar no Kubernetes (kind)
Aplicar o deployment
kubectl apply -f deployment.yaml

Ver pods
kubectl get pods

Editar variável de ambiente
kubectl set env deployment/node-k8s-demo BATCH_SIZE=300

Reiniciar rollout
kubectl rollout restart deployment/node-k8s-demo

📊 Monitoramento de memória

O projeto possui uma função interna:

function getMemoryMB() {
  return (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
}


Essa métrica é usada para entender quanto o processo consome dentro do pod — útil pra ajustar limits e evitar OOMKill.

🧪 Simulação de carga

O worker interno aumenta o consumo de memória proporcionalmente ao valor de:

BATCH_SIZE


Isso permite simular cenários reais onde o pod recebe requisições de múltiplos serviços.

📁 Estrutura do Projeto
node-k8s-demo/
│── index.js
│── Dockerfile
│── deployment.yaml
└── package.json

💡 Objetivo do Projeto

Este repositório foi criado com foco em:

Aprender Kubernetes de verdade

Ver o efeito de limits e requests

Entender rollout e atualização por variável de ambiente

Medir comportamento do Node dentro de um Pod

Criar base para experimentos mais avançados de autoscaling

👨‍💻 Autor

Felipe Domingues
Backend Engineer • Node.js • Containers • Kubernetes
GitHub: https://github.com/Felipedmgs