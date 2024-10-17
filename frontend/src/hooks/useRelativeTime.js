const useRelativeTime = () => {
    const dateFormatter = (dateInput) => {
        let duration = (new Date(dateInput) - new Date()) / 1000;

        const DIVISIONS = [
            { amount: 60, name: "seconds" },
            { amount: 60, name: "minutes" },
            { amount: 24, name: "hours" },
            { amount: 7, name: "days" },
            { amount: 4.34524, name: "weeks" },
            { amount: 12, name: "months" },
            { amount: Number.POSITIVE_INFINITY, name: "years" },
        ];

        const formatter = new Intl.RelativeTimeFormat(undefined, {
            numeric: "auto",
        });

        for (let i = 0; i < DIVISIONS.length; i++) {
            const division = DIVISIONS[i];

            if (Math.abs(duration) < division.amount) {
                return formatter.format(Math.round(duration), division.name);
            }
            duration /= division.amount;
        }
    };

    return dateFormatter;
};

export default useRelativeTime;
