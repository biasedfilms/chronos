/* =========================================================
   CHRONOS
   Main application logic
   ========================================================= */


/* DOM */

const birthDateInput =
    document.getElementById("birthDate");

const discoverButton =
    document.getElementById("discoverBtn");

const backButton =
    document.getElementById("backBtn");

const landingScreen =
    document.getElementById("landing");

const resultsScreen =
    document.getElementById("results");

const errorMessage =
    document.getElementById("errorMessage");

const shareButton =
    document.getElementById("shareBtn");

const shareModal =
    document.getElementById("shareModal");

const closeShareButton =
    document.getElementById("closeShareBtn");

const downloadShareButton =
    document.getElementById("downloadShareBtn");

const shareFeedback =
    document.getElementById("shareFeedback");


/* State */

let liveCounter = null;
let liveCounterStartTimeout = null;
let birthdayCounter = null;

let currentBirthDate = null;
let currentBirthdayMonth = null;
let currentBirthdayDay = null;
let currentResult = null;

let lastFocusedElement = null;
let shareFeedbackTimeout = null;


/* Date input */

birthDateInput.addEventListener("input", (event) => {

    let digits =
        event.target.value.replace(/\D/g, "");

    digits =
        digits.slice(0, 8);

    let formatted = "";

    if (digits.length <= 2) {

        formatted = digits;

    } else if (digits.length <= 4) {

        formatted =
            digits.slice(0, 2) +
            " / " +
            digits.slice(2);

    } else {

        formatted =
            digits.slice(0, 2) +
            " / " +
            digits.slice(2, 4) +
            " / " +
            digits.slice(4, 8);
    }

    event.target.value = formatted;
});


/* Enter submits the date */

birthDateInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        event.preventDefault();

        discoverButton.click();
    }
});


/* Discover */

function showDateError(message) {

    errorMessage.textContent = message;

    birthDateInput.setAttribute(
        "aria-invalid",
        "true"
    );
}


discoverButton.addEventListener("click", () => {

    const input =
        birthDateInput.value.trim();


    if (!input) {

        showDateError(
            "Please enter your date of birth."
        );

        return;
    }


    const match =
        input.match(
            /^(\d{2})\s*\/\s*(\d{2})\s*\/\s*(\d{4})$/
        );


    if (!match) {

        showDateError(
            "Please use DD / MM / YYYY."
        );

        return;
    }


    const day =
        Number(match[1]);

    const month =
        Number(match[2]);

    const year =
        Number(match[3]);


    const birth =
        new Date(
            year,
            month - 1,
            day
        );


    if (
        birth.getFullYear() !== year ||
        birth.getMonth() !== month - 1 ||
        birth.getDate() !== day
    ) {

        showDateError(
            "Please enter a valid date."
        );

        return;
    }


    if (birth > new Date()) {

        showDateError(
            "Your birth date cannot be in the future."
        );

        return;
    }


    errorMessage.textContent = "";

    birthDateInput.removeAttribute(
        "aria-invalid"
    );


    const birthDate =
        `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    currentBirthDate =
        birthDate;

    currentBirthdayMonth =
        month;

    currentBirthdayDay =
        day;


    /* Calculate */

    const stats =
        calculateLifeStats(birthDate);


    /* Born On */

    const bornOn =
        new Date(
            year,
            month - 1,
            day
        );


    const bornOnText =
        bornOn.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );


    /* Weeks */

    const weeksLived =
        Math.floor(
            stats.totalDays / 7
        );


    /* Labels */

    const yearLabel =
        stats.years === 1
            ? "YEAR"
            : "YEARS";

    const monthLabel =
        stats.months === 1
            ? "MONTH"
            : "MONTHS";


    /* Current result */

    currentResult = {

        years:
            stats.years,

        months:
            stats.months,

        yearLabel,

        monthLabel,

        bornOnText,

        totalDays:
            stats.totalDays,

        weeks:
            weeksLived,

        totalHours:
            stats.totalHours,

        totalMinutes:
            stats.totalMinutes,

        totalSeconds:
            stats.totalSeconds
    };


    /* Exact age */

    document.getElementById("exactAge")
        .textContent =
        `${stats.years} ${yearLabel} · ${stats.months} ${monthLabel}`;


    /* Born On */

    document.getElementById("bornOn")
        .textContent =
        bornOnText;


    /* Animated values */

    animateNumber(
        document.getElementById("daysLived"),
        stats.totalDays,
        1600,
        250
    );


    animateNumber(
        document.getElementById("yearsLived"),
        stats.years,
        1100,
        700
    );


    animateNumber(
        document.getElementById("monthsLived"),
        stats.months,
        1100,
        820
    );


    animateNumber(
        document.getElementById("weeksLived"),
        weeksLived,
        1200,
        940
    );


    animateNumber(
        document.getElementById("hoursLived"),
        stats.totalHours,
        1400,
        1060
    );


    animateNumber(
        document.getElementById("minutesLived"),
        stats.totalMinutes,
        1500,
        1180
    );


    animateNumber(
        document.getElementById("secondsLived"),
        stats.totalSeconds,
        1600,
        1300
    );


    /* Birthday countdown */

    startBirthdayCountdown(
        month,
        day
    );


    /* Show results */

    showResults();


    /* Start live counter after animations */

    clearTimeout(
        liveCounterStartTimeout
    );

    liveCounterStartTimeout =
        setTimeout(() => {

            if (
                !resultsScreen.classList.contains(
                    "active"
                )
            ) {
                return;
            }

            startLiveCounter();

        }, 3000);

});


/* Back */

backButton.addEventListener("click", () => {

    closeShareModal();

    clearTimeout(
        liveCounterStartTimeout
    );

    liveCounterStartTimeout =
        null;

    stopLiveCounter();

    stopBirthdayCountdown();

    showLanding();
});


/* =========================================================
   SHARE MY CHRONOS
   ========================================================= */

function getElementText(id) {

    return document.getElementById(id)
        .textContent
        .trim();
}


function getShareData() {

    if (!currentResult) {

        throw new Error(
            "No CHRONOS result is available to share."
        );
    }


    /*
     * Refresh the lifetime values right before
     * generating the downloaded card.
     */

    if (currentBirthDate) {

        const birth =
            createLocalDate(
                currentBirthDate
            );

        const now =
            new Date();

        const difference =
            now.getTime() -
            birth.getTime();


        const seconds =
            Math.floor(
                difference / 1000
            );

        const minutes =
            Math.floor(
                seconds / 60
            );

        const hours =
            Math.floor(
                minutes / 60
            );

        const days =
            calculateCalendarDays(
                birth,
                now
            );

        const weeks =
            Math.floor(
                days / 7
            );


        currentResult.totalSeconds =
            seconds;

        currentResult.totalMinutes =
            minutes;

        currentResult.totalHours =
            hours;

        currentResult.totalDays =
            days;

        currentResult.weeks =
            weeks;
    }


    const birthdayDays =
        getElementText(
            "birthdayDays"
        );

    const birthdayHours =
        getElementText(
            "birthdayHours"
        );

    const birthdayMinutes =
        getElementText(
            "birthdayMinutes"
        );

    const birthdaySeconds =
        getElementText(
            "birthdaySeconds"
        );


    const age =
        `${currentResult.years} ${currentResult.yearLabel} · ` +
        `${currentResult.months} ${currentResult.monthLabel}`;


    return {

        days:
            currentResult.totalDays
                .toLocaleString(),

        age,

        bornOn:
            currentResult.bornOnText,

        weeks:
            currentResult.weeks
                .toLocaleString(),

        hours:
            currentResult.totalHours
                .toLocaleString(),

        minutes:
            currentResult.totalMinutes
                .toLocaleString(),

        seconds:
            currentResult.totalSeconds
                .toLocaleString(),

        birthdayDays,

        birthdayHours,

        birthdayMinutes,

        birthdaySeconds
    };
}


function getBirthdaySummary(data) {

    return `${data.birthdayDays} DAYS · ` +
        `${data.birthdayHours} HOURS · ` +
        `${data.birthdayMinutes} MINUTES · ` +
        `${data.birthdaySeconds} SECONDS`;
}


function updateShareCard(data) {

    document.getElementById("shareDays")
        .textContent =
        data.days;


    document.getElementById("shareAge")
        .textContent =
        data.age;


    document.getElementById("shareBornOn")
        .textContent =
        data.bornOn;


    document.getElementById("shareWeeks")
        .textContent =
        data.weeks;


    document.getElementById("shareHours")
        .textContent =
        data.hours;


    document.getElementById("shareMinutes")
        .textContent =
        data.minutes;


    document.getElementById("shareBirthday")
        .textContent =
        getBirthdaySummary(data);
}


function setShareFeedback(message) {

    clearTimeout(
        shareFeedbackTimeout
    );


    shareFeedback.textContent =
        message;


    if (message) {

        shareFeedbackTimeout =
            setTimeout(() => {

                shareFeedback.textContent =
                    "";

            }, 2400);
    }
}


function openShareModal() {

    if (!currentResult) {
        return;
    }


    updateShareCard(
        getShareData()
    );


    lastFocusedElement =
        document.activeElement;


    shareModal.classList.add(
        "is-open"
    );


    shareModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "share-modal-open"
    );


    document.querySelector(".app")
        .setAttribute(
            "inert",
            ""
        );


    setTimeout(() => {

        closeShareButton.focus();

    }, 0);
}


function closeShareModal() {

    if (
        !shareModal.classList.contains(
            "is-open"
        )
    ) {
        return;
    }


    shareModal.classList.remove(
        "is-open"
    );


    shareModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "share-modal-open"
    );


    document.querySelector(".app")
        .removeAttribute(
            "inert"
        );


    setShareFeedback("");


    if (lastFocusedElement) {

        lastFocusedElement.focus();

        lastFocusedElement =
            null;
    }
}


function drawTrackedText(
    context,
    text,
    x,
    y,
    spacing
) {

    for (const character of text) {

        context.fillText(
            character,
            x,
            y
        );


        x +=
            context.measureText(
                character
            ).width +
            spacing;
    }
}


function fitCanvasText(
    context,
    text,
    maxWidth,
    fontSize
) {

    let size =
        fontSize;


    while (
        size > 20 &&
        context.measureText(text).width > maxWidth
    ) {

        size -= 2;

        context.font =
            `400 ${size}px Manrope, Arial, sans-serif`;
    }


    return size;
}


async function createShareCardBlob() {

    const data =
        getShareData();


    updateShareCard(
        data
    );


    if (document.fonts) {

        await document.fonts.ready;
    }


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        1080;

    canvas.height =
        1350;


    const context =
        canvas.getContext(
            "2d"
        );


    const background =
        context.createLinearGradient(
            0,
            0,
            1080,
            1350
        );


    background.addColorStop(
        0,
        "#15130e"
    );

    background.addColorStop(
        0.48,
        "#080807"
    );

    background.addColorStop(
        1,
        "#050505"
    );


    context.fillStyle =
        background;

    context.fillRect(
        0,
        0,
        1080,
        1350
    );


    context.strokeStyle =
        "rgba(245, 245, 245, 0.025)";

    context.lineWidth =
        1;


    for (
        let position = 72;
        position < 1080;
        position += 72
    ) {

        context.beginPath();

        context.moveTo(
            position,
            0
        );

        context.lineTo(
            position,
            1350
        );

        context.stroke();


        context.beginPath();

        context.moveTo(
            0,
            position
        );

        context.lineTo(
            1080,
            position
        );

        context.stroke();
    }


    const padding =
        92;


    context.fillStyle =
        "#C8A96B";

    context.font =
        "500 28px Manrope, Arial, sans-serif";


    drawTrackedText(
        context,
        "CHRONOS",
        padding,
        108,
        12
    );


    context.fillStyle =
        "#666666";

    context.font =
        "500 24px Manrope, Arial, sans-serif";


    drawTrackedText(
        context,
        "YOUR TIME",
        padding,
        214,
        7
    );


    context.fillStyle =
        "#F5F5F5";

    context.font =
        "300 174px Manrope, Arial, sans-serif";


    const daysSize =
        fitCanvasText(
            context,
            data.days,
            820,
            174
        );


    context.font =
        `300 ${daysSize}px Manrope, Arial, sans-serif`;


    context.fillText(
        data.days,
        padding,
        366
    );


    const daysWidth =
        context.measureText(
            data.days
        ).width;


    context.fillStyle =
        "#8F7546";

    context.font =
        "500 24px Manrope, Arial, sans-serif";


    drawTrackedText(
        context,
        "DAYS",
        padding + daysWidth + 24,
        366,
        5
    );


    context.fillStyle =
        "#A0A0A0";

    context.font =
        "500 28px Manrope, Arial, sans-serif";


    drawTrackedText(
        context,
        data.age,
        padding,
        430,
        3
    );


    context.fillStyle =
        "rgba(143, 117, 70, 0.48)";

    context.fillRect(
        padding,
        488,
        896,
        1
    );


    context.fillStyle =
        "#666666";

    context.font =
        "500 22px Manrope, Arial, sans-serif";


    drawTrackedText(
        context,
        "BORN ON",
        padding,
        552,
        6
    );


    context.fillStyle =
        "#F5F5F5";

    context.font =
        "500 38px Manrope, Arial, sans-serif";


    const bornOnSize =
        fitCanvasText(
            context,
            data.bornOn,
            896,
            38
        );


    context.font =
        `500 ${bornOnSize}px Manrope, Arial, sans-serif`;


    context.fillText(
        data.bornOn,
        padding,
        606
    );


    const statistics = [
        `${data.weeks} WEEKS`,
        `${data.hours} HOURS`,
        `${data.minutes} MINUTES`
    ];


    context.fillStyle =
        "#A0A0A0";

    context.font =
        "500 32px Manrope, Arial, sans-serif";


    statistics.forEach(
        (statistic, index) => {

            const y =
                706 + index * 64;

            context.fillText(
                statistic,
                padding,
                y
            );
        }
    );


    context.fillStyle =
        "rgba(143, 117, 70, 0.48)";

    context.fillRect(
        padding,
        920,
        896,
        1
    );


    context.fillStyle =
        "#666666";

    context.font =
        "500 22px Manrope, Arial, sans-serif";


    drawTrackedText(
        context,
        "NEXT BIRTHDAY",
        padding,
        984,
        6
    );


    context.fillStyle =
        "#C8A96B";

    context.font =
        "500 36px Manrope, Arial, sans-serif";


    const birthday =
        getBirthdaySummary(data);


    const birthdaySize =
        fitCanvasText(
            context,
            birthday,
            896,
            36
        );


    context.font =
        `500 ${birthdaySize}px Manrope, Arial, sans-serif`;


    context.fillText(
        birthday,
        padding,
        1042
    );


    context.fillStyle =
        "#666666";

    context.font =
        "500 22px Manrope, Arial, sans-serif";


    drawTrackedText(
        context,
        "DISCOVER YOUR TIME",
        padding,
        1244,
        5
    );


    context.fillStyle =
        "rgba(143, 117, 70, 0.48)";

    context.fillRect(
        padding,
        1278,
        896,
        1
    );


    return new Promise(
        (resolve, reject) => {

            canvas.toBlob(
                (blob) => {

                    if (blob) {

                        resolve(blob);

                        return;
                    }


                    reject(
                        new Error(
                            "Unable to create share image."
                        )
                    );

                },
                "image/png"
            );
        }
    );
}


/* Share modal events */

shareButton.addEventListener(
    "click",
    () => {
        openShareModal();
    }
);


closeShareButton.addEventListener(
    "click",
    () => {
        closeShareModal();
    }
);


shareModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target.matches(
                "[data-share-close]"
            )
        ) {

            closeShareModal();
        }
    }
);


/* Download */

downloadShareButton.addEventListener(
    "click",
    async () => {

        try {

            const blob =
                await createShareCardBlob();


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                URL.createObjectURL(
                    blob
                );


            link.download =
                "chronos-result.png";


            document.body.append(
                link
            );


            link.click();

            link.remove();


            setTimeout(() => {

                URL.revokeObjectURL(
                    link.href
                );

            }, 0);


            setShareFeedback(
                "DOWNLOADED"
            );

        } catch (error) {

            setShareFeedback(
                "DOWNLOAD UNAVAILABLE"
            );
        }
    }
);


/* Modal keyboard handling */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            !shareModal.classList.contains(
                "is-open"
            )
        ) {
            return;
        }


        if (event.key === "Escape") {

            closeShareModal();

            return;
        }


        if (event.key === "Tab") {

            const focusable =
                [
                    ...shareModal.querySelectorAll(
                        "button:not([disabled])"
                    )
                ];


            if (!focusable.length) {
                return;
            }


            const first =
                focusable[0];

            const last =
                focusable[
                    focusable.length - 1
                ];


            if (
                event.shiftKey &&
                document.activeElement === first
            ) {

                event.preventDefault();

                last.focus();

            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {

                event.preventDefault();

                first.focus();
            }
        }
    }
);


/* =========================================================
   LIVE LIFETIME COUNTER
   ========================================================= */

function startLiveCounter() {

    stopLiveCounter();


    liveCounter =
        setInterval(
            () => {

                if (!currentBirthDate) {
                    return;
                }


                const birth =
                    createLocalDate(
                        currentBirthDate
                    );

                const now =
                    new Date();


                const difference =
                    now.getTime() -
                    birth.getTime();


                const seconds =
                    Math.floor(
                        difference / 1000
                    );


                const minutes =
                    Math.floor(
                        seconds / 60
                    );


                const hours =
                    Math.floor(
                        minutes / 60
                    );


                const days =
                    calculateCalendarDays(
                        birth,
                        now
                    );


                const weeks =
                    Math.floor(
                        days / 7
                    );


                currentResult.totalSeconds =
                    seconds;

                currentResult.totalMinutes =
                    minutes;

                currentResult.totalHours =
                    hours;

                currentResult.totalDays =
                    days;

                currentResult.weeks =
                    weeks;


                document.getElementById(
                    "secondsLived"
                ).textContent =
                    seconds.toLocaleString();


                document.getElementById(
                    "minutesLived"
                ).textContent =
                    minutes.toLocaleString();


                document.getElementById(
                    "hoursLived"
                ).textContent =
                    hours.toLocaleString();


                document.getElementById(
                    "weeksLived"
                ).textContent =
                    weeks.toLocaleString();


                document.getElementById(
                    "daysLived"
                ).textContent =
                    days.toLocaleString();

            },
            1000
        );
}


function stopLiveCounter() {

    if (liveCounter) {

        clearInterval(
            liveCounter
        );

        liveCounter =
            null;
    }
}


/* =========================================================
   BIRTHDAY COUNTDOWN
   ========================================================= */

function startBirthdayCountdown(
    month,
    day
) {

    stopBirthdayCountdown();


    currentBirthdayMonth =
        month;

    currentBirthdayDay =
        day;


    updateBirthdayCountdown();


    birthdayCounter =
        setInterval(
            () => {

                updateBirthdayCountdown();

            },
            1000
        );
}


function updateBirthdayCountdown() {

    if (
        currentBirthdayMonth === null ||
        currentBirthdayDay === null
    ) {
        return;
    }


    const now =
        new Date();


    const birthdayThisYear =
        createBirthdayDate(
            now.getFullYear(),
            currentBirthdayMonth,
            currentBirthdayDay
        );


    const birthdayToday =
        now.getMonth() ===
            birthdayThisYear.getMonth() &&
        now.getDate() ===
            birthdayThisYear.getDate();


    if (birthdayToday) {

        document.getElementById(
            "birthdayDays"
        ).textContent =
            "0";


        document.getElementById(
            "birthdayHours"
        ).textContent =
            "00";


        document.getElementById(
            "birthdayMinutes"
        ).textContent =
            "00";


        document.getElementById(
            "birthdaySeconds"
        ).textContent =
            "00";


        document.getElementById(
            "birthdayMessage"
        ).textContent =
            "TODAY IS YOUR BIRTHDAY";


        return;
    }


    let nextBirthday =
        createBirthdayDate(
            now.getFullYear(),
            currentBirthdayMonth,
            currentBirthdayDay
        );


    if (nextBirthday <= now) {

        nextBirthday =
            createBirthdayDate(
                now.getFullYear() + 1,
                currentBirthdayMonth,
                currentBirthdayDay
            );
    }


    const difference =
        nextBirthday.getTime() -
        now.getTime();


    const totalSeconds =
        Math.max(
            0,
            Math.floor(
                difference / 1000
            )
        );


    const days =
        Math.floor(
            totalSeconds / 86400
        );


    const hours =
        Math.floor(
            (totalSeconds % 86400) /
            3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) /
            60
        );


    const seconds =
        totalSeconds % 60;


    document.getElementById(
        "birthdayDays"
    ).textContent =
        days.toLocaleString();


    document.getElementById(
        "birthdayHours"
    ).textContent =
        String(hours).padStart(
            2,
            "0"
        );


    document.getElementById(
        "birthdayMinutes"
    ).textContent =
        String(minutes).padStart(
            2,
            "0"
        );


    document.getElementById(
        "birthdaySeconds"
    ).textContent =
        String(seconds).padStart(
            2,
            "0"
        );


    document.getElementById(
        "birthdayMessage"
    ).textContent =
        "";
}


function stopBirthdayCountdown() {

    if (birthdayCounter) {

        clearInterval(
            birthdayCounter
        );

        birthdayCounter =
            null;
    }
}