document.addEventListener("DOMContentLoaded", () => {
  const gasPriceElement = document.getElementById("gasPrice");
  const lastUpdatedElement = document.getElementById("lastUpdated");
  const networkSelect = document.getElementById("network");

  // 网络配置
  const NETWORKS = {
    bsc_testnet: {
      name: "BSC Testnet",
      rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    },
    amoy: {
      name: "Amoy Testnet",
      rpcUrl: "https://polygon-amoy.gateway.tenderly.co",
    },
    sepolia: {
      name: "Sepolia Testnet",
      rpcUrl: "https://rpc.sepolia.ethpandaops.io",
    },
  };

  // 从 localStorage 获取上次选择的网络
  const savedNetwork = localStorage.getItem("selectedNetwork") || "bsc_testnet";
  networkSelect.value = savedNetwork;

  /**
   * 获取当前的 Gas 价格
   */
  async function getGasPrice() {
    const selectedNetwork = networkSelect.value;
    const network = NETWORKS[selectedNetwork];

    try {
      const response = await fetch(network.rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_gasPrice",
          params: [],
          id: 1,
        }),
      });

      const data = await response.json();

      if (data.result) {
        const gasPriceWei = parseInt(data.result, 16);
        const gasPriceGwei = gasPriceWei / 1e9;
        gasPriceElement.textContent = `${gasPriceGwei.toFixed(2)} Gwei`;

        const now = new Date();
        lastUpdatedElement.textContent = `最后更新: ${now.toLocaleTimeString()}`;
      } else {
        gasPriceElement.textContent = "无法获取 Gas 价格";
        lastUpdatedElement.textContent = "";
      }
    } catch (error) {
      console.error(`获取 ${network.name} Gas 价格时出错:`, error);
      gasPriceElement.textContent = "出错";
      lastUpdatedElement.textContent = "";
    }
  }

  // 监听网络选择变化
  networkSelect.addEventListener("change", () => {
    localStorage.setItem("selectedNetwork", networkSelect.value);
    getGasPrice();
  });

  // 初始获取 Gas 价格
  getGasPrice();

  // 每隔 15 秒刷新一次
  setInterval(getGasPrice, 15000);
});
