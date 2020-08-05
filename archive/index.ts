import { Painting, Path } from "./model";
import { randomPath, clone, MutateConfig, mutatePainting } from "./generator";
import { render } from "./renderer";

let parentCanvas: HTMLCanvasElement;
let parent: Painting;
let children: Array<Painting>;

const numChildren = 20;

let mutateConfig: MutateConfig;

const setupChildCanvas = (canvas: HTMLCanvasElement, painting: Painting) => {
    canvas.addEventListener("click", () => {
        parent = painting;
        render(painting, parentCanvas);
        generate();
    });
}

const generate = () => {
    children = [];
    const container = document.getElementById("children");
    container.innerHTML = "";
    for (let i = 0; i < numChildren; i++) {
        const canvas = document.createElement("canvas") as HTMLCanvasElement;

        canvas.id = `child_${i}`;
        canvas.width = parentCanvas.width;
        canvas.height = parentCanvas.height;
        canvas.setAttribute("style", parentCanvas.getAttribute("style"));
        container.appendChild(canvas);

        const newPainting = clone(parent);
        mutatePainting(newPainting, mutateConfig);
        children.push(newPainting);

        render(newPainting, canvas);
        setupChildCanvas(canvas, newPainting);
    }
};

const randomize = () => {
    const paths: Path[] = [];
    for (let i = 0; i < 10; i++) {
        paths.push(randomPath(mutateConfig));
    }
    parent = {
        paths
    };
    render(parent, parentCanvas);
    generate();
};

const onLoad = () => {
    parentCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    mutateConfig = {
        lineWidthProbability: 0.3,
        maxLine: 5,
        minLine: 0.01,
        minPoint: 0.1,
        maxPoint: 50,
        pathProbability: 0.3,
        pointProbability: 0.3,
        strokeStyleProbability: 0.3,
        addPathProbability: 0.1,
        addPointProbability: 0.5,
        removePathProbability: 0.1,
        removePointProbability: 0.1,
        canvasWidth: parentCanvas.width,
        canvasHeight: parentCanvas.height,
        minPoints: 2,
        maxPoints: 10,
        minLineWidth: 1,
        maxLineWidth: 10
    }
    randomize();

    const generateButton = document.getElementById("generate") as HTMLButtonElement;
    generateButton.addEventListener("click", generate);
}

if (document.readyState === "complete") {
    onLoad();
} else {

    document.addEventListener("DOMContentLoaded", onLoad);
}