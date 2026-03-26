import { parse, isValid, parseJSON, format } from 'date-fns';
import 'date-fns-tz';

const parseDateTime = (date, defaultValue) => {
    let parsed = parse(date, "yyyy-MM-dd HH:mm:ss", new Date());
    if (isValid(parsed)) {
        return parsed;
    }
    parsed = parse(date, "yyyy-MM-dd HH:mm", new Date());
    if (isValid(parsed)) {
        return parsed;
    }
    parsed = parse(date, "yyyy-MM-dd", new Date());
    if (isValid(parsed)) {
        return parsed;
    }
    parsed = parseJSON(date);
    if (isValid(parsed)) {
        return parsed;
    }
    if (typeof defaultValue === "undefined") {
        throw new Error(`Invalid date: ${date}`);
    }
    return defaultValue;
};
const getBtwDates = (btw) => {
    if (!Array.isArray(btw)) {
        btw = [btw];
    }
    for (const b of btw) {
        const match = b.match(/^\$btw:(.+),(.+)$/);
        if (match) {
            try {
                const from = parseDateTime(match[1]);
                const to = parseDateTime(match[2]);
                console.log("------", match[2], format(to, "yyyy-MM-dd HH:mm:ss"));
                console.log("????????????????????????????", format(parse("2020-01-01 23:59:59", "yyyy-MM-dd HH:mm:ss", new Date()), "yyyy-MM-dd HH:mm:ss"));
                return [from, to];
            }
            catch {
                /* ignore */
            }
        }
    }
    return null;
};

const setPartialParams = (partialParams, searchParams) => {
    const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
    Object.keys(partialParams).forEach((key) => {
        const value = partialParams[key];
        if (value === "" || !value) {
            params.delete(key);
            params.delete(`${key}[]`);
        }
        else if (Array.isArray(value)) {
            params.delete(key);
            params.delete(`${key}[]`);
            for (const item of value) {
                params.append(`${key}[]`, item);
            }
        }
        else {
            params.delete(`${key}[]`);
            params.set(key, typeof value === "number" ? value.toString() : value);
        }
    });
    return `?${params}`;
};

export { getBtwDates, parseDateTime, setPartialParams };
//# sourceMappingURL=index.js.map
