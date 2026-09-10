const DEFAULT_GROWTH_HOURS = 72; 

let countdownInterval;

function calculate() {
    const plantInput = document.getElementById('plantTime').value;
    
    if (!plantInput) {
        alert("请先选择种植时间！");
        return;
    }

    const plantDate = new Date(plantInput);
    
    const harvestDate = new Date(plantDate.getTime() + DEFAULT_GROWTH_HOURS * 60 * 60 * 1000);

    const harvestStr = harvestDate.toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit' 
    });

    document.getElementById('harvestTime').innerText = harvestStr;

    startCountdown(harvestDate);
}

function startCountdown(targetDate) {
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

    update();
    countdownInterval = setInterval(update, 1000);
}
