const pick = <T extends object, K extends keyof T>(
    obj: T,
    keys: readonly K[],
): Partial<T> => {
    const finalObject: Partial<T> = {};

    for (const key of keys) {
        if (
            obj &&
            Object.prototype.hasOwnProperty.call(obj, key) &&
            obj[key] !== undefined
        ) {
            finalObject[key] = obj[key];
        }
    }

    return finalObject;
};

export default pick;
