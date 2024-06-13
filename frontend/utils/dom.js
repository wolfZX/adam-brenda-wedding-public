export const getFieldElementValue = (id) => {
    if (id) {
        if (document.getElementById(id)) {
            const element = document.getElementById(id);
            if (element && element.value) {
                return element.value.trim();
            }
        }
    }
    return '';
};