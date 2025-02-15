document.addEventListener("DOMContentLoaded", () => {
  const networkContainer = document.getElementById("networkContainer");
  const lastUpdatedElement = document.getElementById("lastUpdated");

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
      rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/demo",
    },
  };

  // 创建网络卡片 DOM
  Object.keys(NETWORKS).forEach((networkId) => {
    const networkCard = document.createElement("div");
    networkCard.className = "network-card";
    networkCard.innerHTML = `
      <div class="network-name">${NETWORKS[networkId].name}</div>
      <div class="gas-price" id="gas-${networkId}">加载中...</div>
      <div class="update-time" id="update-${networkId}" style="font-size: 0.8em; color: #888;"></div>
    `;
    networkContainer.appendChild(networkCard);
  });

  /**
   * 获取指定网络的 Gas 价格
   */
  async function getGasPrice(networkId) {
    const network = NETWORKS[networkId];
    const gasPriceElement = document.getElementById(`gas-${networkId}`);
    const updateTimeElement = document.getElementById(`update-${networkId}`);

    try {
      // 添加超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.result) {
        const gasPriceWei = parseInt(data.result, 16);
        const gasPriceGwei = gasPriceWei / 1e9;
        gasPriceElement.textContent = `${gasPriceGwei.toFixed(2)} Gwei`;
        const now = new Date();
        updateTimeElement.textContent = `更新于: ${now.toLocaleTimeString()}`;
      } else {
        throw new Error("No result in response");
      }
    } catch (error) {
      console.error(`获取 ${network.name} Gas 价格时出错:`, error);
      if (error.name === "AbortError") {
        gasPriceElement.textContent = "请求超时";
      } else {
        gasPriceElement.textContent = "无法获取";
      }
      updateTimeElement.textContent = "";
    }
  }

  /**
   * 更新所有网络的 Gas 价格
   */
  function updateAllGasPrices() {
    Object.keys(NETWORKS).forEach((networkId) => {
      getGasPrice(networkId);
    });
  }

  // 初始获取所有网络的 Gas 价格
  updateAllGasPrices();

  // 每隔 15 秒刷新一次所有网络的价格
  setInterval(updateAllGasPrices, 15000);
});
