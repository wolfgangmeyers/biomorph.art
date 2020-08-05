import { Painting } from "./model";
import { PathBuilder, processors } from "./pathbuilder";

export function render(painting: Painting, canvas: HTMLCanvasElement, label?: string) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pathBuilder: PathBuilder = {
        speed: 0,
        strokeStyle: "#fff",
        lineWidth: 1,
        x: 0,
        y: 0
    };
    for (let path of painting.paths) {
        for (let instruction of path.instructions) {
            processors[instruction.type](ctx, pathBuilder, instruction.args);
        }
        processors["end"](ctx, pathBuilder, null);
    }
    if (label) {
        ctx.strokeStyle = "#0ff";
        ctx.font = "normal 16px sans"
        ctx.lineWidth = 2;
        ctx.strokeText(label, 20, 20);
    }

}