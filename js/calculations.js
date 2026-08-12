/* =========================================================
   CHRONOS
   Date & lifetime calculations
   ========================================================= */


/* =========================
   HELPERS
   ========================= */

/**
 * Creates a local Date object from a date string in:
 * YYYY-MM-DD format.
 *
 * This avoids relying on JavaScript's parsing of
 * date-only strings, which can introduce timezone shifts.
 */
function createLocalDate(dateString) {

    const [year, month, day] =
        dateString.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day
    );
}


/**
 * Returns the number of whole calendar days
 * between two local dates.
 */
function calculateCalendarDays(startDate, endDate) {

    const millisecondsPerDay =
        24 * 60 * 60 * 1000;

    return Math.floor(
        (
            Date.UTC(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate()
            ) -
            Date.UTC(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()
            )
        ) /
        millisecondsPerDay
    );
}


/**
 * Creates a birthday date for a given year. JavaScript's native
 * date normalization intentionally keeps February 29 birthdays on
 * March 1 in non-leap years, matching the existing age calculation.
 */
function createBirthdayDate(year, month, day) {

    return new Date(
        year,
        month - 1,
        day
    );
}


/* =========================
   LIFE STATISTICS
   ========================= */

function calculateLifeStats(birthDate) {

    const now = new Date();

    const birth =
        birthDate instanceof Date
            ? new Date(birthDate)
            : createLocalDate(birthDate);


    /* -------------------------
       Total elapsed time
       ------------------------- */

    const difference =
        now.getTime() -
        birth.getTime();


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const totalMinutes =
        Math.floor(
            totalSeconds / 60
        );


    const totalHours =
        Math.floor(
            totalMinutes / 60
        );


    /*
     * Use calendar days rather than deriving
     * the value from elapsed hours. This keeps
     * the day count aligned with the user's
     * actual calendar date.
     */

    const totalDays =
        calculateCalendarDays(
            birth,
            now
        );


    /* -------------------------
       Exact age
       ------------------------- */

    let years =
        now.getFullYear() -
        birth.getFullYear();

    let months =
        now.getMonth() -
        birth.getMonth();

    let days =
        now.getDate() -
        birth.getDate();


    /*
     * Borrow from the previous month when
     * the current day is earlier than the
     * birth day.
     */

    if (days < 0) {

        months--;

        const previousMonth =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                0
            );

        days +=
            previousMonth.getDate();
    }


    /*
     * Borrow from the previous year when
     * the current month is earlier than
     * the birth month.
     */

    if (months < 0) {

        years--;

        months += 12;
    }


    return {
        years,
        months,
        days,

        totalSeconds,
        totalMinutes,
        totalHours,
        totalDays
    };
}
