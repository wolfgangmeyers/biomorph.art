import { saveAs } from "file-saver";
import { Painting, Instruction } from "./model";
import { clone, mutatePainting, generateRandomInstruction, generateBeginInstruction } from "./generator";
import { render } from "./renderer";

let parentCanvas: HTMLCanvasElement;
let parent: Painting;
let children: Array<Painting>;

const history: Painting[] = [];

const numChildren = 7;

const undo = () => {
    if (history.length > 0) {
        parent = history.pop();
        render(parent, parentCanvas, "Parent");
        generate();
    }
};

const setupChildCanvas = (canvas: HTMLCanvasElement, painting: Painting) => {
    canvas.addEventListener("click", () => {
        history.push(parent);
        parent = painting;
        render(painting, parentCanvas, "Parent");
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

        render(newPainting, canvas, "Child");
        setupChildCanvas(canvas, newPainting);
    }
};

const save = () => {
    const filename = prompt("Save file as:", "painting.txt");
    if (filename) {
        const blob = new Blob([JSON.stringify(parent)], { type: "text/plain" });
        saveAs(blob, filename)
    }
}

const onLoadFile = (files: FileList) => {
    // FileReader support
    if (FileReader && files && files.length) {
        const fr = new FileReader();
        fr.onload = () => {
            const paintingStr = fr.result.toString();
            try {
                parent = JSON.parse(paintingStr);
                render(parent, parentCanvas, "Parent");
                generate();
            } catch (e) {
                console.error(e);
                alert("Could not load painting");
            }
        };
        fr.readAsText(files[0]);
    } else {
        alert("Your browser can't load files. Try chrome, safari, firefox or edge");
    }
}

const randomize = () => {
    const instructions: Instruction[] = [generateBeginInstruction(parentCanvas.width, parentCanvas.height)];
    const initialInstructionCount = Math.floor(Math.random() * 100);
    for (let i = 0; i < initialInstructionCount; i++) {
        instructions.push(generateRandomInstruction());
    }
    parent = {
        paths: [
            { instructions }
        ]
    };
    render(parent, parentCanvas, "Parent");
    generate();
};

const onLoad = () => {
    parentCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    randomize();

    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", randomize);

    document.getElementById("undo").addEventListener("click", undo);
    document.getElementById("save").addEventListener("click", save);
    document.getElementById("load").addEventListener("change", evt => onLoadFile((<HTMLInputElement>evt.target).files));

    parentCanvas.addEventListener("click", generate);
}

if (document.readyState === "complete") {
    onLoad();
} else {

    document.addEventListener("DOMContentLoaded", onLoad);
}