import { Painting } from "./model";
import { PathBuilder, processors } from "./pathbuilder";

export function render(painting: Painting, canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const pathBuilder: PathBuilder = {
        speed: 0,
        strokeStyle: "#fff",
        lineWidth: 1,
        x: 0,
        y: 0
    };
    for (let instruction of painting.instructions) {
        processors[instruction.type](ctx, pathBuilder, instruction.args);
    }
    processors["end"](ctx, pathBuilder, null);
}