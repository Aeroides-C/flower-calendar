// ========== 初始化 ==========

function init() {

    // 默认目标日期设为本周日
    setDefaultTargetDate();

}


// ========== 设置默认目标日期 ==========

function setDefaultTargetDate() {

    const now = new Date();

    const dayOfWeek = now.getDay();
    // 0 = 周日
    // 1 = 周一
    // ...
    // 6 = 周六

    const daysUntilSunday =
        dayOfWeek === 0
            ? 0
            : 7 - dayOfWeek;


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


    document.getElementById(
        "targetDate"
    ).value =
        `${yyyy}-${mm}-${dd}`;

}


// ========== 核心计算 ==========

function calculate() {

    const hoursInput =
        document.getElementById(
            "hoursInput"
        ).value;


    const targetDateInput =
        document.getElementById(
            "targetDate"
        ).value;


    const resultDiv =
        document.getElementById(
            "result"
        );


    const resultBody =
        document.getElementById(
            "resultBody"
        );


    // ========== 输入验证 ==========

    if (
        !hoursInput ||
        Number(hoursInput) <= 0
    ) {

        showError(
            "请输入成熟时间～"
        );

        return;

    }


    if (!targetDateInput) {

        showError(
            "请选择期望开花的日期～"
        );

        return;

    }


    const hours =
        Number(hoursInput);


    const targetDate =
        new Date(
            targetDateInput +
            "T00:00:00"
        );


    // ========== 目标日期范围 ==========
    // 从当天 00:00 到 23:59

    const targetStart =
        new Date(targetDate);

    targetStart.setHours(
        0,
        0,
        0,
        0
    );


    const targetEnd =
        new Date(targetDate);

    targetEnd.setHours(
        23,
        59,
        59,
        999
    );


    // ========== 倒推种植窗口 ==========

    const matureMilliseconds =
        hours *
        60 *
        60 *
        1000;


    const plantStart =
        new Date(
            targetStart.getTime()
            - matureMilliseconds
        );


    const plantEnd =
        new Date(
            targetEnd.getTime()
            - matureMilliseconds
        );


    // ========== 格式化日期 ==========

    const now =
        new Date();


    const plantStartStr =
        formatDateTime(
            plantStart
        );


    const plantEndStr =
        formatDateTime(
            plantEnd
        );


    const targetStr =
        formatDate(
            targetDate
        );


    // ========== 判断当前状态 ==========

    let statusHTML = "";


    // 种植窗口已经结束
    if (now > plantEnd) {

        statusHTML = `
            <div class="warning">
                ⚠️ 种植窗口已经过了！现在已经来不及种啦，换一个目标日期试试吧～
            </div>
        `;

    }


    // 当前正处于种植窗口
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


    // 还没有到种植时间
    else {

        const diffMs =
            plantStart.getTime()
            - now.getTime();


        const diffMinutes =
            Math.floor(
                diffMs /
                (1000 * 60)
            );


        const diffDays =
            Math.floor(
                diffMinutes /
                (24 * 60)
            );


        const remainMinutesAfterDays =
            diffMinutes %
            (24 * 60);


        const diffHours =
            Math.floor(
                remainMinutesAfterDays /
                60
            );


        const remainMinutes =
            remainMinutesAfterDays %
            60;


        let waitStr = "";


        if (diffDays > 0) {

            waitStr +=
                `${diffDays}天`;

        }


        if (diffHours > 0) {

            waitStr +=
                `${diffHours}小时`;

        }


        if (
            diffDays === 0 &&
            remainMinutes > 0
        ) {

            waitStr +=
                `${remainMinutes}分钟`;

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


    // ========== 构建结果 ==========

    resultBody.innerHTML = `

        <div style="margin-bottom: 8px;">

            🌱

            <span class="tag">
                成熟周期 ${formatHours(hours)}
            </span>

        </div>


        <hr>


        <div>

            📅
            <strong>
                期望开花：
            </strong>

            ${targetStr}

            （当天 00:00 ~ 23:59）

        </div>


        <div style="margin-top: 6px;">

            🕐
            <strong>
                种植窗口：
            </strong>

            <br>

            <span class="highlight">
                ${plantStartStr}
            </span>

            ～

            <span class="highlight">
                ${plantEndStr}
            </span>

        </div>


        ${statusHTML}

    `;


    // 显示结果区域
    resultDiv.style.display =
        "block";


    // 平滑滚动到结果区域
    resultDiv.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// ========== 错误提示 ==========

function showError(msg) {

    const resultDiv =
        document.getElementById(
            "result"
        );


    const resultBody =
        document.getElementById(
            "resultBody"
        );


    resultBody.innerHTML = `

        <div
            style="
                color: #c62828;
            "
        >
            😢 ${msg}
        </div>

    `;


    resultDiv.style.display =
        "block";


    resultDiv.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}


// ========== 日期时间格式化 ==========

function formatDateTime(date) {

    const month =
        date.getMonth() + 1;


    const day =
        date.getDate();


    const hours =
        String(
            date.getHours()
        ).padStart(
            2,
            "0"
        );


    const minutes =
        String(
            date.getMinutes()
        ).padStart(
            2,
            "0"
        );


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
        `${hours}:${minutes}`
    );

}


// ========== 日期格式化 ==========

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


// ========== 成熟时间格式化 ==========

function formatHours(hours) {

    if (Number.isInteger(hours)) {

        return `${hours} 小时`;

    }

    return `${hours} 小时`;

}


// ========== 启动 ==========

init();
