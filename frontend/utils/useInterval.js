'use client'

import { useEffect, useRef } from "react";

export default function useInterval(callback, delay, reactivate) {
    const intervalRef = useRef();
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (typeof delay === 'number' && reactivate) {
            intervalRef.current = window.setInterval(() => callbackRef.current(), delay);
            return () => window.clearInterval(intervalRef.current);
        }

        () => window.clearInterval(intervalRef.current);
    }, [delay, reactivate]);

    return intervalRef;
};