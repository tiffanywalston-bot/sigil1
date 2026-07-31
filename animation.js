/**
 * ============================================================
 * SIGIL1 Animation System
 * Version 1.0
 * ============================================================
 */

export class Animation {

    constructor() {

        this.time = 0;

        this.delta = 0;

    }

    update(delta) {

        this.delta = delta;
        this.time += delta * 0.001;

    }

    pulse(speed = 1) {

        return (Math.sin(this.time * speed) + 1) / 2;

    }

    breathe(speed = 0.5, amount = 10) {

        return Math.sin(this.time * speed) * amount;

    }

    rotate(speed = 0.25) {

        return this.time * speed;

    }

    oscillate(min, max, speed = 1) {

        const value = (Math.sin(this.time * speed) + 1) / 2;

        return min + (max - min) * value;

    }

    glow(base = 0.6, range = 0.4, speed = 1) {

        return base + Math.sin(this.time * speed) * range;

    }

}