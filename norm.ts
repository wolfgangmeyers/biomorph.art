export function norm(value: number, min: number, max: number): number {
    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }
    return value;
}

export function wrap(value: number, min: number, max: number): number {
    while (value < min) {
        value += max;
    }
    while (value > max) {
        value -= max;
    }
    return value;
}