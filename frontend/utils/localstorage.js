'use client'

export const isLocalStorageAvailable = (localStorage) => {
    if (localStorage) {
        const test = "test";
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    return false;
}

export const setLocalStorage = (localStorage, key, value) => {
    if (localStorage && isLocalStorageAvailable(localStorage)) {
        localStorage.setItem(key, value);
    }
};

export const getLocalStorage = (localStorage, key) => {
    if (localStorage && isLocalStorageAvailable(localStorage)) {
        return localStorage.getItem(key);
    }
    return null;
};