import { Scene2d, Item2Scene, NumberUtils, Easing } from 'jcv-ts-utils';
export type Choice = { name: string; id: string, size: number, hightLight?:boolean };
export class Roue implements Item2Scene {
    isUpdated = false;
    scenePriority = 0;
    rotation: number = Math.random() * NumberUtils.PI2;

    rotationSpeed: number = 0.2;
    rotationFriction = 1;
    scale: number = 0.9
    cursorRotation: number = 0;
    constructor(
        private x: number,
        private y: number,
        private grandRoue: HTMLImageElement,
        private ptiteRoue: HTMLImageElement,
        private cursor: HTMLImageElement,
        private fond: HTMLImageElement,
        private choices: Choice[]) {
    }
    draw2d(scene: Scene2d) {
        const { ctx } = scene;
        ctx.translate(this.x, this.y);
        ctx.save()
        ctx.scale(this.scale + 0.01, this.scale + 0.01)
        ctx.translate(-this.fond.width / 2+15, -this.fond.height / 2);
        ctx.drawImage(this.fond, 0, 0);
        ctx.restore()
        ctx.save();
        ctx.rotate(this.rotation);
        ctx.save();
        ctx.scale(this.scale, this.scale)
        ctx.translate(-this.grandRoue.width / 2, -this.grandRoue.height / 2);
        ctx.drawImage(this.grandRoue, 0, 0);
        ctx.restore();
        const quarterSize = NumberUtils.PI2 / this.choices.length;
        const color = "#311111"
        for (let i = 0; i < this.choices.length; i++) {
            const choice = this.choices[i];
            if (!choice) continue;
            ctx.save(); // save for text
            ctx.rotate(quarterSize / 2 + quarterSize * i);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, this.scale * this.grandRoue.width / 2.16);
            ctx.strokeStyle = color;
            ctx.lineWidth = 10;
            ctx.stroke();
            ctx.closePath();
            scene.writeText({
                fillStyle: choice.hightLight ?"#741f16" : color,
                font: {
                    size: choice.size * this.scale,
                    type: "Odachi",
                },


                x: 250,
                y: (choice.size / 2) * this.scale,
                text: choice.name,
            });
            ctx.restore(); // restore text
        }
        ctx.restore();
        ctx.save();
        ctx.rotate(-this.rotation*2);

        ctx.scale(this.scale, this.scale)
        ctx.translate((-this.ptiteRoue.width +15) / 2, (-this.ptiteRoue.height-20) / 2);
        ctx.drawImage(this.ptiteRoue, 0, 0);
        ctx.restore();
        ctx.translate(this.scale * (this.grandRoue.width + 170) / 2, 0)
        ctx.rotate(this.cursorRotation);
        ctx.scale(this.scale, this.scale)
        ctx.translate(-this.cursor.width / 2, -this.cursor.height / 2);
        ctx.drawImage(this.cursor, 0, 0);

    }
    previousIndex: number | null = null;
    onIndexChange: (() => void) | null = null;
    onStop: ((choice: Choice) => void) | null = null;
    update(scene: Scene2d) {
        this.isUpdated = true;
        this.rotation += this.rotationSpeed;
        this.rotationSpeed *= this.rotationFriction;
        
        this.rotation = NumberUtils.angleRangeLoop(this.rotation);
        const positiveAngle = (this.rotation + NumberUtils.PI2) / 2;
        const quarterSize = NumberUtils.PI2 / this.choices.length;
        const indexChoice: number = this.choices.length - 1 -
            Math.floor(
                NumberUtils.rangeLoop(0, positiveAngle / (quarterSize / 2), this.choices.length)
            );
        if (indexChoice !== this.previousIndex) {
            this.onIndexChange && this.onIndexChange();
            scene
                .addEasing({
                    easing: Easing.easeShakeOut(2, true),
                    start: 0,
                    time: 15,
                    scale: 0.03 + this.rotationSpeed,

                    onNext: (value) => (this.cursorRotation = value),
                })
                .then(() => {
                    this.cursorRotation = 0;
                });
        }
        this.previousIndex = indexChoice;
        const absSpeed = Math.abs(this.rotationSpeed);
        if (absSpeed > 0.0001 && Math.random() > 0.6) {
            this.rotationSpeed *= 0.992;
            if (absSpeed <= 0.0005) {
                this.rotationSpeed = 0;
                if (this.onStop) {
                    this.onStop(this.choices[indexChoice]);
                    this.choices[indexChoice].hightLight =  true;
                }
            }
        }
    }
    destroy() { }
    tourne() {
        // calculer pour que ca fasse 30 secondes
        this.rotationSpeed = 0.5;
        setTimeout(()=>{
            this.rotationFriction = 0.25
        },5  * 1000)
    }

}

