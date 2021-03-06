export class NumberUtils {
    static clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    };

    static mod(x: number, mod: number) {
        return ((x % mod) + mod) % mod;
    };

    static map(min: number, max: number, ratio: number) {
        return (max - min) * ratio + min;
    };
}