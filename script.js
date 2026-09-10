// ========== 花种数据库 ==========
// 格式：{ 花名: 成熟小时数 }
const FLOWER_DB = {
    // 常见花种
    "向日葵": 24,
    "玫瑰": 48,
    "百合": 72,
    "薰衣草": 36,
    "郁金香": 30,
    "樱花": 60,
    "牡丹": 96,
    "雏菊": 12,
    "康乃馨": 40,
    "紫罗兰": 55,
    "蝴蝶兰": 84,
    "满天星": 20,
    "勿忘我": 28,
    "风信子": 68,
    "铃兰": 44,
    "绣球花": 80,
    "山茶花": 100,
    "水仙": 50,
    "梅花": 120,
    "桃花": 32,
    "茉莉": 45,
    "栀子花": 65,
    "芍药": 90,
    "海棠": 110,
    "睡莲": 38,
    "彼岸花": 168,
    "蒲公英": 8,
    "三色堇": 22,
    "鸢尾花": 58,
    "马蹄莲": 75,
};

// ========== 初始化 ==========
function init() {
    // 填充花种下拉框
    const select = document.getElementById("flowerSelect");
    for (const [name, hours] of Object.entries(FLOWER_DB)) {
        const option = document.createElement("option");
        option.value = hours;
        option.textContent = `${name}（${hours}小时）`;
        select.appendChild(option);
    }

    // 选择花种时自动填充小时数
    select.addEventListener("change", function () {
        if (this.value) {
            document.getElementById("hoursInput").value = this.value;
            document.getElementById("flowerName").value = this.options[this.selectedIndex].text.split("（")[0];
        }
    });

    // 手动输入时取消下拉选择
    document.getElementById("hoursInput").addEventListener("input", function () {
        if (this.value) {
            document.getElementById("flowerSelect").value = "";
        }
    });

    // 默认目标日期设为本周日
    setDefaultTargetDate();
}

function setDefaultTargetDate() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=周日, 1=周一, ...
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + daysUntilSunday);

    const yyyy = sunday.getFullYear();
    const mm = String(sunday.getMonth() + 1).padStart(2, "0");
    const dd = String(sunday.getDate()).padStart(2, "0");
    document.getElementById("targetDate").value = `${yyyy}-${mm}-${dd}`;
}

// ========== 核心计算 ==========
function calculate() {
    const hoursInput = document.getElementById("hoursInput").value;
    const targetDateInput = document.getElementById("targetDate").value;
    const flowerNameInput = document.getElementById("flowerName").value.trim();
    const flowerSelect = document.getElementById("flowerSelect");
    const resultDiv = document.getElementById("result");
    const resultBody = document.getElementById("resultBody");

    // 验证
    if (!hoursInput || hoursInput <= 0) {
        showError("请先选择花种或输入成熟时间～");
        return;
    }
    if (!targetDateInput) {
        showError("请选择期望开花的日期～");
        return;
    }

    const hours = parseInt(hoursInput);
    const targetDate = new Date(targetDateInput + "T00:00:00");

    // 目标日期当天 00:00 到 23:59
    const targetStart = new Date(targetDate);
    targetStart.setHours(0, 0, 0, 0);
    const targetEnd = new Date(targetDate);
    targetEnd.setHours(23, 59, 59, 999);

    // 倒退计算种植窗口
    const plantStart = new Date(targetStart.getTime() - hours * 60 * 60 * 1000);
    const plantEnd = new Date(targetEnd.getTime() - hours * 60 * 60 * 1000);

    // 获取花名
    let flowerName = flowerNameInput;
    if (!flowerName && flowerSelect.value) {
        flowerName = flowerSelect.options[flowerSelect.selectedIndex].text.split("（")[0];
    }
    if (!flowerName) {
        flowerName = "未知花种";
    }

    // 格式化
    const now = new Date();
    const plantStartStr = formatDateTime(plantStart);
    const plantEndStr = formatDateTime(plantEnd);
    const targetStr = formatDate(targetDate);

    // 判断状态
    let statusHTML = "";
    if (now > plantEnd) {
        statusHTML = `
            <div class="warning">
                ⚠️ 种植窗口已经过了！现在已经来不及种啦，换一个目标日期试试吧～
            </div>`;
    } else if (now >= plantStart && now <= plantEnd) {
        statusHTML = `
            <div style="color: #2e7d32; font-weight: 700; margin-top: 8px;">
                ✅ 现在是种植黄金期！赶紧去种吧～
            </div>`;
    } else if (now < plantStart) {
        const diffMs = plantStart.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        const remainHours = diffHours % 24;
        let waitStr = "";
        if (diffDays > 0) waitStr += `${diffDays}天`;
        if (remainHours > 0) waitStr += `${remainHours}小时`;
        statusHTML = `
            <div style="color: #e91e63; font-weight: 600; margin-top: 8px;">
                ⏳ 还没到种植时间哦～再等 ${waitStr} 就可以开始种啦！
            </div>`;
    }

    // 构建结果
    resultBody.innerHTML = `
        <div style="margin-bottom: 8px;">
            🌸 <strong>${flowerName}</strong>
            <span class="tag">成熟周期 ${hours} 小时</span>
        </div>
        <hr>
        <div>📅 <strong>期望开花：</strong>${targetStr}（当天 00:00 ~ 23:59）</div>
        <div style="margin-top: 6px;">
            🕐 <strong>种植窗口：</strong><br>
            <span class="highlight">${plantStartStr}</span> ～ <span class="highlight">${plantEndStr}</span>
        </div>
        ${statusHTML}
    `;

    resultDiv.style.display = "block";
    resultDiv.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showError(msg) {
    const resultDiv = document.getElementById("result");
    const resultBody = document.getElementById("resultBody");
    resultBody.innerHTML = `<div style="color: #c62828;">😢 ${msg}</div>`;
    resultDiv.style.display = "block";
    resultDiv.scrollIntoView({ behavior: "smooth", block: "center" });
}

// ========== 工具函数 ==========
function formatDateTime(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日（周${weekday}）${hours}:${minutes}`;
}

function formatDate(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日（周${weekday}）`;
}

// ========== 启动 ==========
init();