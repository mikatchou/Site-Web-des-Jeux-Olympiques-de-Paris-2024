import { useState, useEffect } from "react";

export default function Timer({
    start,
    setTimer,
    }: {
    start: number;
    setTimer: React.Dispatch<React.SetStateAction<number | null>>;
    }) {
    const [timeLeft, setTimeLeft] = useState(start);

    useEffect(() => {
        setTimeLeft(start);
    }, [start]);

    useEffect(() => {
        if (timeLeft <= 0) {
        setTimer(null);
        return;
        }

        const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, setTimer]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <>
        {timeLeft > 0 && (
            <div className="timer">
            Temps restant pour demander un nouveau code :{" "}
            {minutes}:{String(seconds).padStart(2, "0")}
            </div>
        )}
        </>
    );
}
