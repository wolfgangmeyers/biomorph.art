import { Point, Path, Painting } from "./model";

export function randomPath(cfg: MutateConfig): Path {
    const numPoints = Math.round(Math.random() * (cfg.maxPoints - cfg.minPoints) + cfg.minPoints);
    const points: Array<Point> = [];
    for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * cfg.canvasWidth;
        const y = Math.random() * cfg.canvasHeight;
        points.push({x, y});
    }
    const strokeStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
    const lineWidth = Math.random() * (cfg.maxLineWidth - cfg.minLineWidth) + cfg.minLineWidth;
    return {
        lineWidth, strokeStyle, points
    }
}

export function mutatePoint(point: Point, min: number, max: number) {
    let xMutationAmount = Math.random() * (max - min) + min;
    if (Math.random() > 0.5) {
        xMutationAmount *= -1;
    }
    let yMutationAmount = Math.random() * (max - min) + min;
    if (Math.random() > 0.5) {
        yMutationAmount *= -1;
    }
    point.x += xMutationAmount;
    point.y += yMutationAmount;
}

export interface MutateConfig {
    canvasWidth: number;
    canvasHeight: number;

    minPoints: number;
    maxPoints: number;
    minLineWidth: number;
    maxLineWidth: number;

    pointProbability: number;
    minPoint: number;
    maxPoint: number;
    lineWidthProbability: number;
    minLine: number;
    maxLine: number;
    strokeStyleProbability: number;
    pathProbability: number;
    addPathProbability: number;
    removePathProbability: number;
    addPointProbability: number;
    removePointProbability: number;
}

export function mutatePath(path: Path, cfg: MutateConfig) {
    for (let point of path.points) {
        if (Math.random() < cfg.pointProbability) {
            mutatePoint(point, cfg.minPoint, cfg.maxPoint);
        }
    }
    // if (Math.random() < cfg.addPointProbability) {
    //     const newPoint = clone(path.points[path.points.length - 1]);
    //     mutatePoint(newPoint, cfg.minPoint, cfg.maxPoint);
    //     path.points.push(newPoint);
    // }
    // if (Math.random() < cfg.removePointProbability && path.points.length > 2) {
    //     path.points.splice(Math.floor(Math.random() * path.points.length))
    // }
    if (Math.random() < cfg.lineWidthProbability) {
        let lineWidthMutationAmount = Math.random() * (cfg.maxLine - cfg.minLine) + cfg.minLine;
        if (Math.random() > 0.5) {
            lineWidthMutationAmount *= -1;
        }
        path.lineWidth += lineWidthMutationAmount;
    }
    // TODO: break into hsl and mutate each separately, convert back to hex code.
    // there are good libraries for this..
    if (Math.random() < cfg.strokeStyleProbability) {
        path.strokeStyle = "#" + Math.floor(Math.random()*16777215).toString(16);
    }
}

export function mutatePainting(painting: Painting, cfg: MutateConfig) {
    for (let path of painting.paths) {
        if (Math.random() < cfg.pathProbability) {
            mutatePath(path, cfg);
        }
    }
    if (Math.random() < cfg.addPathProbability) {
        painting.paths.push(randomPath(cfg));
    }
    if (Math.random() < cfg.removePathProbability && painting.paths.length > 1) {
        painting.paths.splice(Math.floor(Math.random() * painting.paths.length), 1);
    }
}

export function clone<T>(item: T): T {
    return JSON.parse(JSON.stringify(item));
}

