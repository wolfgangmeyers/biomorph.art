import { Painting, PathBuilder, InstructionProcessorSet } from "./model";
import { norm } from "./norm";
import * as d3 from "d3-color";

const processors: InstructionProcessorSet = {
    "begin": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        builder.speed = args.speed;
        builder.strokeStyle = args.strokeStyle;
        builder.lineWidth = args.lineWidth;
        builder.x = args.x;
        builder.y = args.y;

        ctx.strokeStyle = builder.strokeStyle;
        ctx.lineWidth = builder.lineWidth;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(builder.x, builder.y);
    },
    "strokeStyle": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(builder.x, builder.y);
        const color = d3.color(builder.strokeStyle).rgb();
        color.r += args.r;
        color.r = norm(color.r, 0, 255);
        color.g += args.g;
        color.g = norm(color.g, 0, 255);
        color.b += args.b;
        color.b = norm(color.b, 0, 255);
        builder.strokeStyle = color.hex();
        ctx.strokeStyle = builder.strokeStyle;
    },
    "position": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        builder.x += Math.cos(args.angle) * builder.speed;
        builder.x = norm(builder.x, 0, ctx.canvas.width);
        builder.y += Math.sin(args.angle) * builder.speed;
        builder.y = norm(builder.y, 0, ctx.canvas.height);
        ctx.lineTo(builder.x, builder.y);
    },
    "lineWidth": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(builder.x, builder.y);
        builder.lineWidth += args.amount;
        builder.lineWidth = norm(builder.lineWidth, 1, 10);
        ctx.lineWidth = builder.lineWidth;
    },
    "speed": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        builder.speed += args.amount;
        builder.speed = norm(builder.speed, 0.5, 50);
    },
    "end": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        ctx.stroke();
    }
}

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