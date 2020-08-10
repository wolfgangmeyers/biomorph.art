import $ from "jquery";
import "bootstrap";

import { saveAs } from "file-saver";
import { Painting, Instruction, Mode } from "./model";
import { clone, mutatePainting, generateRandomInstruction, generateBeginInstruction } from "./generator";
import { render } from "./renderer";
import { mode, getConfig, setConfig } from "./config";

let parentCanvas: HTMLCanvasElement;
let _parent: Painting;
let children: Array<Painting>;

function setParent(parent: Painting) {
    _parent = parent;
    const config = getConfig();
    localStorage.setItem("parent", JSON.stringify({
        parent: _parent, config,
    }));
}

const history: Painting[] = [];

const numChildren = 7;

const undo = () => {
    if (history.length > 0) {
        setParent(history.pop());
        renderParent();
        generate();
    }
};


/**
 * Relationships enabled?
 */
export function rel(): boolean {
    return (<HTMLInputElement>document.getElementById("relationships")).checked;
}

const setupChildCanvas = (canvas: HTMLCanvasElement, painting: Painting) => {
    canvas.addEventListener("click", () => {
        history.push(_parent);
        setParent(painting);
        renderParent();
        generate();
    });
}

const renderParent = () => {
    render(_parent, parentCanvas, mode(), rel() ? "Parent" : "");
};

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

        const newPainting = clone(_parent);
        mutatePainting(newPainting, mode());
        children.push(newPainting);

        render(newPainting, canvas, mode(), rel() ? "Child" : "");
        setupChildCanvas(canvas, newPainting);
    }
};

const save = () => {
    const parent = _parent;
    const config = getConfig();
    const filename = prompt("Save file as:", "painting.txt");
    if (filename) {
        const blob = new Blob([JSON.stringify({parent, config})], { type: "text/plain" });
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
                const {parent, config} = JSON.parse(paintingStr);
                setParent(parent);
                setConfig(config);
                renderParent();
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
        instructions.push(generateRandomInstruction(mode()));
    }
    setParent({
        paths: [
            { instructions }
        ]
    });
    renderParent();
    generate();
};

const onLoad = () => {
    parentCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    try {
        const {parent, config} = JSON.parse(localStorage.getItem("parent"));
        setParent(parent);
        setConfig(config);
        renderParent();
        generate();
    } catch(_) {
        randomize();
    }


    const restartButton = document.getElementById("restart");
    restartButton.addEventListener("click", randomize);

    document.getElementById("undo").addEventListener("click", undo);
    document.getElementById("save").addEventListener("click", save);
    document.getElementById("load").addEventListener("change", evt => onLoadFile((<HTMLInputElement>evt.target).files));
    document.getElementById("relationships").addEventListener("change", () => {
        renderParent();
        generate();
    });
    // document.getElementById("export-image-button").addEventListener("click", onExportImage);
    $("#export-image-modal").on("shown.bs.modal", onExportImage);

    parentCanvas.addEventListener("click", generate);
}

function onExportImage() {
    const canvas = <HTMLCanvasElement>document.getElementById("export-image-canvas");
    render(_parent, canvas, mode(), null, 10);
    // $("#export-image-modal").modal({
    //     backdrop: true,
    //     focus: true,
    //     keyboard: true,
    //     show: true,
    // });
}

if (document.readyState === "complete") {
    onLoad();
} else {

    document.addEventListener("DOMContentLoaded", onLoad);
}