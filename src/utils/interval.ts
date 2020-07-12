export class Interval {
    static milliseconds(delay: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), delay);
        });
    }
    static seconds(delay: number) {
        return Interval.milliseconds(delay * 1000);
    }
}