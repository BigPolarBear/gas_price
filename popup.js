document.addEventListener("DOMContentLoaded", () => {
  const gasPriceElement = document.getElementById("gasPrice");
  const lastUpdatedElement = document.getElementById("lastUpdated");

  // BSC Testnet 的 RPC URL
  const rpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/";

  /**
   * 获取当前的 Gas 价格
   */
  async function getGasPrice() {
    try {
      const response = await fetch(rpcUrl, {
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
        // 将 Hex 转换为十进制
        const gasPriceWei = parseInt(data.result, 16);
        // 转换为 Gwei
        const gasPriceGwei = gasPriceWei / 1e9;
        gasPriceElement.textContent = `${gasPriceGwei} Gwei`;

        // 更新最后更新时间
        const now = new Date();
        lastUpdatedElement.textContent = `最后更新: ${now.toLocaleTimeString()}`;
      } else {
        gasPriceElement.textContent = "无法获取 Gas 价格";
        lastUpdatedElement.textContent = "";
      }
    } catch (error) {
      console.error("获取 Gas 价格时出错:", error);
      gasPriceElement.textContent = "出错";
      lastUpdatedElement.textContent = "";
    }
  }

  // 初始获取 Gas 价格
  getGasPrice();

  // 每隔 15 秒刷新一次
  setInterval(getGasPrice, 15000);
});
