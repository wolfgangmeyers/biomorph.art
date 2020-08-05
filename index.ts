import { Painting } from "./model";
import { clone, mutatePainting, generateRandomInstruction, generateBeginInstruction } from "./generator";
import { render } from "./renderer";
import { Instruction } from "./pathbuilder";

let parentCanvas: HTMLCanvasElement;
let parent: Painting;
let children: Array<Painting>;

const numChildren = 8;

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
        // canvas.setAttribute("style", parentCanvas.getAttribute("style"));
        canvas.setAttribute(
            "style",
            "background-color: #000; width: 400px; height: 400px; border: 1px solid black; margin: 10px;"
        )
        container.appendChild(canvas);

        const newPainting = clone(parent);
        mutatePainting(newPainting);
        children.push(newPainting);

        render(newPainting, canvas);
        setupChildCanvas(canvas, newPainting);
    }
};

const randomize = () => {
    const instructions: Instruction[] = [generateBeginInstruction(parentCanvas.width, parentCanvas.height)];
    const initialInstructionCount = Math.floor(Math.random() * 100);
    for (let i = 0; i < initialInstructionCount; i++) {
        instructions.push(generateRandomInstruction());
    }
    parent = {
        instructions
    };
    render(parent, parentCanvas);
    generate();
};

const onLoad = () => {
    parentCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    randomize();

    const generateButton = document.getElementById("generate") as HTMLButtonElement;
    generateButton.addEventListener("click", generate);
}

if (document.readyState === "complete") {
    onLoad();
} else {

    document.addEventListener("DOMContentLoaded", onLoad);
}