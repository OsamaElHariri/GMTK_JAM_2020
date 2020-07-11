export interface MoveEngine {
    getHorizontalAxis(): number;
    getVerticalAxis(): number;

    getHorizontalAxisJustPressed(): number;
    getVerticalAxisJustPressed(): number;
}