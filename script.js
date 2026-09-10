// 默认成熟时间（小时），因为没有下拉菜单了，这里固定一个值或者你可以自己改
// 比如默认设为 72 小时（3天），你可以根据需要修改这个数字
const DEFAULT_GROWTH_HOURS = 72; 

let countdownInterval;

function calculate() {
    const plantInput = document.getElementById('plantTime').value;
    
    if (!plantInput) {
        alert("请先选择种植时间！");
        return;
    }

    const plantDate = new Date(plantInput);
    
    // 计算收获时间 = 种植时间 + 默认小时数
    const harvestDate = new Date(plantDate.getTime() + DEFAULT_GROWTH_HOURS * 60 * 60 * 1000);

    // 格式化日期显示
    const harvestStr = harvestDate.toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
    });

    document.getElementById('harvestTime').innerText = harvestStr;

    // 开始倒计时
    startCountdown(harvestDate);
}

function startCountdown(targetDate) {
    // 清除之前的定时器
    if (countdownInterval) clearInterval(countdownInterval);

    function update() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
            document.getElementById('countdown').innerText = "已成熟！🎉";
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('countdown').innerText = 
            `${days}天 ${hours}时 ${minutes}分 ${seconds}秒`;
    }

    update(); // 立即执行一次
    countdownInterval = setInterval(update, 1000); // 每秒更新
}
