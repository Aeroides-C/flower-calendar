// 成熟时间固定为 4 小时
const MATURE_HOURS = 4;

let harvestDateTime = null;
let countdownTimer = null;

// 计算收获时间
function calculate() {
    const plantTimeStr = document.getElementById("plantTime").value;
    if (!plantTimeStr) {
        alert("请先选择种植时间！");
        return;
    }

    const plantTime = new Date(plantTimeStr);
    harvestDateTime = new Date(plantTime.getTime() + MATURE_HOURS * 60 * 60 * 1000);

    // 显示收获时间
    document.getElementById("harvestTime").textContent = formatDateTime(harvestDateTime);

    // 启动倒计时
    clearInterval(countdownTimer);
    updateCountdown();
    countdownTimer = setInterval(updateCountdown, 1000);
}

// 更新倒计时
function updateCountdown() {
    if (!harvestDateTime) return;

    const now = new Date();
    const diff = harvestDateTime - now;

    if (diff <= 0) {
        document.getElementById("countdown").textContent = "✅ 已成熟！";
        clearInterval(countdownTimer);
        return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("countdown").textContent =
        `${hours}小时 ${minutes}分钟 ${seconds}秒`;
}

// 格式化日期时间
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
