
const { startMemoryWatcher, startWorkerLoop } = require("./auto_scaling");

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

// endpoint de saúde para Kubernetes
app.get("/healthz", (req, res) => {
  res.status(200).json({ ok: true, ts: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 App rodando na porta ${PORT} com batchSize=${BATCH_SIZE} na porta ${PORT}`);
  startMemoryWatcher();
  startWorkerLoop();
});
