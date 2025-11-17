let BATCH_SIZE = parseInt(process.env.BATCH_SIZE || "100", 10);
let bigArray = []; // simula consumo de memória

async function simulateWork() {
  for (let i = 0; i < BATCH_SIZE; i++) {
    // cada item ~10KB
    bigArray.push(Buffer.alloc(1024 * 10));
  }
}

function getMemoryMB() {
  return (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
}

function startMemoryWatcher() {
  setInterval(() => {
    const used = parseFloat(getMemoryMB());

    console.log(`💾 MEM: ${used}MB | BATCH_SIZE=${BATCH_SIZE} | ARR_SIZE=${bigArray.length}`);

    // alta memória: reduz 50%
    if (used > 200 && BATCH_SIZE > 10) {
      BATCH_SIZE = Math.floor(BATCH_SIZE / 2);
      bigArray = bigArray.slice(Math.floor(bigArray.length / 2)); // limpa metade
      console.log(`⚠️ Alta memória! Novo BATCH_SIZE=${BATCH_SIZE}`);
    }

    // baixa memória: aumenta 20%
    if (used < 80 && BATCH_SIZE < 2000) {
      BATCH_SIZE = Math.floor(BATCH_SIZE * 1.2);
      console.log(`🟢 Memória OK. Novo BATCH_SIZE=${BATCH_SIZE}`);
    }

  }, 3000);
}

async function startWorkerLoop() {
  console.log("🚀 Worker consumindo memória…");
  while (true) {
    await simulateWork();
    await new Promise(res => setTimeout(res, 200));
  }
}


function getMemoryStats() {
  const usedBytes = process.memoryUsage().rss;
  const usedMB = usedBytes / 1024 / 1024;

  const limitMB = parseInt(process.env.MEMORY_LIMIT_MB || "0", 10);
  const percent = limitMB > 0 ? (usedMB / limitMB) * 100 : null;

  return {
    usedMB: Number(usedMB.toFixed(1)),
    limitMB: limitMB || null,
    percent: percent !== null ? Number(percent.toFixed(1)) : null,
  };
}


module.exports = {
  startMemoryWatcher,
  startWorkerLoop
};
