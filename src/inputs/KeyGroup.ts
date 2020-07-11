export class KeyGroup {
    keys: Phaser.Input.Keyboard.Key[] = [];

    constructor(keys?: Phaser.Input.Keyboard.Key[] | Phaser.Input.Keyboard.Key) {
        if (keys)
            this.keys = this.keys.concat(keys);
    }

    hasKeyDown(): boolean {
        for (let i = 0; i < this.keys.length; i++)
            if (this.keys[i].isDown) return true;
        return false;
    }

    hasKeyJustPressed(): boolean {
        for (let i = 0; i < this.keys.length; i++)
            if (Phaser.Input.Keyboard.JustDown(this.keys[i])) return true;
        return false;
    }

    addKeys(newKeys: Phaser.Input.Keyboard.Key[]): void {
        newKeys.forEach(key => {
            this.addKey(key);
        });
    }

    addKey(newKey: Phaser.Input.Keyboard.Key): void {
        if (!this.hasKey(newKey))
            this.keys.push(newKey);
    }

    removeKey(keyToRemove: Phaser.Input.Keyboard.Key): void {
        if (this.hasKey(keyToRemove))
            this.keys.filter((key: Phaser.Input.Keyboard.Key) => {
                return key.keyCode !== keyToRemove.keyCode;
            });
        else
            return null;
    }

    hasKey(key: Phaser.Input.Keyboard.Key): boolean {
        for (let i = 0; i < this.keys.length; i++)
            if (this.keys[i].keyCode === key.keyCode) return true;
        return false;
    }
}