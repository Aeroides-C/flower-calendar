document.addEventListener("DOMContentLoaded", function () {
    setDefaultTargetDate();
});


function setDefaultTargetDate() {
    const targetDateInput = document.getElementById("targetDate");

    if (!targetDateInput) {
        console.error("找不到 id=targetDate 的日期输入框");
        return;
    }

    const now = new Date();

    const dayOfWeek = now.getDay();
    const daysUntilSunday =
        dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

    const sunday = new Date(now);

    sunday.setDate(
        now.getDate() + daysUntilSunday
    );

    const yyyy =
        sunday.getFullYear();

    const mm =
        String(
            sunday.getMonth() + 1
        ).padStart(2, "0");

    const dd =
        String(
            sunday.getDate()
        ).padStart(2, "0");

    targetDateInput.value =
        `${yyyy}-${mm}-${dd}`;
}


function calculate() {
    const hoursInput =
        document.getElementById("hoursInput");

    const targetDateInput =
        document.getElementById("targetDate");

    const resultDiv =
        document.getElementById("result");

    const resultBody =
        document.getElementById("resultBody");


    // 检查 HTML 元素是否存在
    if (!hoursInput) {
        console.error("找不到 id=hoursInput 的成熟时间输入框");
        return;
    }

    if (!targetDateInput) {
        console.error("找不到 id=targetDate 的日期输入框");
        return;
    }

    if (!resultDiv || !resultBody) {
        console.error("找不到结果显示区域");
        return;
    }


    const hoursValue =
        hoursInput.value;

    const targetValue =
        targetDateInput.value;


    // 输入验证
    if (
        !hoursValue ||
        Number(hoursValue) <= 0
    ) {
        showError(
            "请输入正确的成熟时间～"
        );

        return;
    }


    if (!targetValue) {
        showError(
            "请选择期望开花的日期～"
        );

        return;
    }


    const hours =
        Number(hoursValue);


    // 目标开花日期
    const targetDate =
        new Date(
            targetValue +
            "T00:00:00"
        );


    // 开花日期当天 00:00
    const targetStart =
        new Date(targetDate);

    targetStart.setHours(
        0,
        0,
        0,
        0
    );


    // 开花日期当天 23:59
    const targetEnd =
        new Date(targetDate);

    targetEnd.setHours(
        23,
        59,
        59,
        999
    );


    // 成熟时间换算成毫秒
    const matureMilliseconds =
        hours *
        60 *
        60 *
        1000;


    // 倒推最早种植时间
    const plantStart =
        new Date(
            targetStart.getTime()
            - matureMilliseconds
        );


    // 倒推最晚种植时间
    const plantEnd =
        new Date(
            targetEnd.getTime()
            - matureMilliseconds
        );


    const now =
        new Date();


    let statusHTML = "";


    // 已经过了种植窗口
    if (now > plantEnd) {

        statusHTML = `
            <div class="warning">
                ⚠️ 种植窗口已经过了！现在已经来不及种啦，换一个目标日期试试吧～
            </div>
        `;

    }


    // 当前就在种植窗口
    else if (
        now >= plantStart &&
        now <= plantEnd
    ) {

        statusHTML = `
            <div
                style="
                    color: #2e7d32;
                    font-weight: 700;
                    margin-top: 8px;
                "
            >
                ✅ 现在是种植黄金期！赶紧去种吧～
            </div>
        `;

    }


    // 还没到种植时间
    else {

        const diffMs =
            plantStart.getTime()
            - now.getTime();


        const totalMinutes =
            Math.floor(
                diffMs /
                60000
            );


        const days =
            Math.floor(
                totalMinutes /
                1440
            );


        const hoursLeft =
            Math.floor(
                (
                    totalMinutes %
                    1440
                ) / 60
            );


        const minutesLeft =
            totalMinutes % 60;


        let waitStr = "";


        if (days > 0) {
            waitStr +=
                `${days}天`;
        }


        if (hoursLeft > 0) {
            waitStr +=
                `${hoursLeft}小时`;
        }


        if (
            days === 0 &&
            minutesLeft > 0
        ) {
            waitStr +=
                `${minutesLeft}分钟`;
        }


        if (!waitStr) {
            waitStr =
                "不到1分钟";
        }


        statusHTML = `
            <div
                style="
                    color: #e91e63;
                    font-weight: 600;
                    margin-top: 8px;
                "
            >
                ⏳ 还没到种植时间哦～再等 ${waitStr} 就可以开始种啦！
            </div>
        `;

    }


    resultBody.innerHTML = `
        <div style="margin-bottom: 8px;">
            🌱
            <span class="tag">
                成熟周期 ${hours} 小时
            </span>
        </div>

        <hr>

        <div>
            📅
            <strong>期望开花：</strong>
            ${formatDate(targetDate)}
            （当天 00:00 ~ 23:59）
        </div>

        <div style="margin-top: 6px;">
            🕐
            <strong>种植窗口：</strong>
            <br>

            <span class="highlight">
                ${formatDateTime(plantStart)}
            </span>

            ～

            <span class="highlight">
                ${formatDateTime(plantEnd)}
            </span>
        </div>

        ${statusHTML}
    `;


    resultDiv.style.display =
        "block";


    resultDiv.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


function showError(message) {
    const resultDiv =
        document.getElementById("result");

    const resultBody =
        document.getElementById("resultBody");

    if (!resultDiv || !resultBody) {
        return;
    }


    resultBody.innerHTML = `
        <div style="color: #c62828;">
            😢 ${message}
        </div>
    `;


    resultDiv.style.display =
        "block";
}


function formatDateTime(date) {
    const month =
        date.getMonth() + 1;

    const day =
        date.getDate();

    const hour =
        String(
            date.getHours()
        ).padStart(2, "0");

    const minute =
        String(
            date.getMinutes()
        ).padStart(2, "0");


    const weekdays = [
        "日",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六"
    ];


    const weekday =
        weekdays[
            date.getDay()
        ];


    return (
        `${month}月${day}日` +
        `（周${weekday}）` +
        `${hour}:${minute}`
    );
}


function formatDate(date) {
    const month =
        date.getMonth() + 1;

    const day =
        date.getDate();


    const weekdays = [
        "日",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六"
    ];


    const weekday =
        weekdays[
            date.getDay()
        ];


    return (
        `${month}月${day}日` +
        `（周${weekday}）`
    );
}
