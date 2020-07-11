import { MoveEngine } from "./MoveEngine";
import { InputKeys } from "../inputs/InputKeys";

export class InputsMoveEngine implements MoveEngine {
    private keys = InputKeys.getInstance();

    getHorizontalAxis(): number {
        return this.keys.getHorizontalAxis();
    }

    getVerticalAxis(): number {
        return this.keys.getVerticalAxis();
    }

    getHorizontalAxisJustPressed(): number {
        return this.keys.getHorizontalAxisJustPressed();
    }

    getVerticalAxisJustPressed(): number {
        return this.keys.getVerticalAxisJustPressed();
    }
}