import { Painting, PathBuilder, InstructionProcessorSet, Mode } from "./model";
import { norm, wrap } from "./norm";
import * as d3 from "d3-color";
import { maxLineWidth, maxSpeed, transparentBackground, angleRestriction, maxLineWidthMutation } from "./config";

const processors: InstructionProcessorSet = {
    "begin": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        builder.speed = args.speed;
        builder.strokeStyle = args.strokeStyle;
        builder.lineWidth = args.lineWidth;
        builder.x = args.x;
        builder.y = args.y;

        ctx.strokeStyle = builder.strokeStyle;
        ctx.fillStyle = builder.strokeStyle;
        ctx.lineWidth = builder.lineWidth;
        ctx.lineCap = "round";
        if (builder.mode == "lines") {
            ctx.beginPath();
            ctx.moveTo(builder.x, builder.y);
        }
    },
    "strokeStyle": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        if (builder.mode == "lines") {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(builder.x, builder.y);
        }
        const color = d3.color(builder.strokeStyle).rgb();
        color.r += args.r;
        color.r = norm(color.r, 0, 255);
        color.g += args.g;
        color.g = norm(color.g, 0, 255);
        color.b += args.b;
        color.b = norm(color.b, 0, 255);
        builder.strokeStyle = color.hex();
        ctx.strokeStyle = builder.strokeStyle;
        ctx.fillStyle = builder.strokeStyle;
    },
    "position": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        let angle = args.angle;
        if (angleRestriction() == "60") {
            angle = Math.floor(angle / (Math.PI * 2 / 6)) * (Math.PI * 2 / 6);
        } else if (angleRestriction() == "90") {
            angle = Math.floor(angle / (Math.PI / 2)) * (Math.PI / 2);
        } else if (angleRestriction() == "120") {
            angle = Math.floor(angle / (Math.PI * 2 / 3)) * (Math.PI * 2 / 3);
        }
        builder.x += Math.cos(angle) * builder.speed;
        builder.x = norm(builder.x, 0, ctx.canvas.width);
        builder.y += Math.sin(angle) * builder.speed;
        builder.y = norm(builder.y, 0, ctx.canvas.height);
        if (builder.mode == "lines") {
            ctx.lineTo(builder.x, builder.y);
        }
    },
    "lineWidth": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        if (builder.mode == "lines") {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(builder.x, builder.y);
        }
        builder.lineWidth += args.amount;
        builder.lineWidth = wrap(builder.lineWidth, 0.01, 1);
        ctx.lineWidth = maxLineWidth() * builder.lineWidth;
    },
    "speed": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        builder.speed += args.amount;
        builder.speed = wrap(builder.speed, 0.5, maxSpeed());
    },
    "icon": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        ctx.font = `600 ${args.size} "Font Awesome 5 Free"`;
        builder.x += Math.cos(args.angle) * builder.speed;
        builder.x = norm(builder.x, 0, ctx.canvas.width);
        builder.y += Math.sin(args.angle) * builder.speed;
        builder.y = norm(builder.y, 0, ctx.canvas.height);
        ctx.save();

        ctx.translate(builder.x, builder.y);
        ctx.rotate(args.angle);
        ctx.fillText(args.icon, 0, 0);
        ctx.restore();
    },
    "end": (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => {
        ctx.stroke();
    }
}

export function render(painting: Painting, canvas: HTMLCanvasElement, mode: Mode, label?: string, scale?: number) {
    const ctx = canvas.getContext("2d");
    if (transparentBackground()) {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const pathBuilder: PathBuilder = {
        speed: 0,
        strokeStyle: "#fff",
        lineWidth: 1,
        x: 0,
        y: 0,
        mode,
        scale: scale || 1
    };
    ctx.save();
    ctx.scale(scale, scale);
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

        // ctx.font = '600 48px "Font Awesome 5 Free"';
        // ctx.strokeText("\uf829", 200, 200);
    }
    ctx.restore();
}