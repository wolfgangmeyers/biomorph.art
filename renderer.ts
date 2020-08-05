import { Painting } from "./model";

export function render(painting: Painting, canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let path of painting.paths) {
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);
        for (let point of path.points.slice(1)) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = path.strokeStyle;
        ctx.lineWidth = path.lineWidth;
        ctx.stroke();
    }
}