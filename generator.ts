import * as d3 from "d3-color";

import { Painting, InstructionType, Instruction, Mode } from "./model";
import { norm, wrap } from "./norm";
import { fa_unicodes } from "./fa";

export function generateBeginInstruction(canvasWidth: number, canvasHeight: number): Instruction {

    return {
        type: "begin",
        args: {
            speed: Math.random() * 10 + 1,
            strokeStyle: d3.rgb(
                Math.random() * 255,
                Math.random() * 255,
                Math.random() * 255,
            ).hex(),
            lineWidth: Math.random() * 5 + 0.1,
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
        }
    }
}

export function generateRandomInstruction(mode: Mode): Instruction {
    const instructionTypes: InstructionType[] = [
        "strokeStyle",
        "lineWidth",
        "speed",
    ];
    if (mode == "lines") {
        instructionTypes.push("position");
    } else {
        instructionTypes.push("icon");
    }
    const instructionType = instructionTypes[Math.floor(Math.random() * instructionTypes.length)];
    return instructionGenerators[instructionType]();
}

const instructionGenerators = {
    "strokeStyle": generateStrokeStyleInstruction,
    "position": generatePositionInstruction,
    "lineWidth": generateLineWidthInstruction,
    "speed": generateSpeedInstruction,
    "icon": generateIconInstruction,
}

const instructionMutators = {
    "strokeStyle": mutateStrokeStyleInstruction,
    "position": mutatePositionInstruction,
    "begin": mutateBeginInstruction,
    "lineWidth": mutateLineWidthInstruction,
    "speed": mutateBeginInstruction,
    "end": mutateBeginInstruction,
    "icon": mutateBeginInstruction,
}

function generateIconInstruction(): Instruction {
    // size, angle, icon
    const size = Math.floor(Math.random() * 20 + 6) + "px";
    const angle = Math.random() * Math.PI * 2;
    const icon = fa_unicodes[Math.floor(Math.random() * fa_unicodes.length)];
    return {
        type: "icon",
        args: {
            size,
            angle,
            icon
        }
    }
}

function generateStrokeStyleInstruction(): Instruction {
    return {
        type: "strokeStyle",
        args: {
            r: Math.random() * config.maxColorMutation * 2 - config.maxColorMutation,
            g: Math.random() * config.maxColorMutation * 2 - config.maxColorMutation,
            b: Math.random() * config.maxColorMutation * 2 - config.maxColorMutation,
        }
    };
}

function generatePositionInstruction(): Instruction {
    return {
        type: "position",
        args: {
            angle: Math.random() * Math.PI * 2,
        },
    };
}

function generateLineWidthInstruction(): Instruction {
    return {
        type: "lineWidth",
        args: {
            amount: Math.random() * config.maxLineWidthMutation * 2 - config.maxLineWidthMutation,
        }
    };
}

function generateSpeedInstruction(): Instruction {
    return {
        type: "speed",
        args: {
            amount: Math.random() * config.maxSpeedMutation * 2 - config.maxSpeedMutation
        }
    };
}

const config = {
    maxMutationIterations: 200,
    addPositionProbability: 0.3,
    addIconProbability: 0.3,
    addStrokeStyleProbability: 0.1,
    addSpeedProbability: 0.3,
    addLineWidthProbability: 0.1,

    mutateInstructionProbability: 0.3,
    removeInstructionProbability: 0.3,
    startNewPathProbability: 0.005,
    removePathProbability: 0.005,

    maxPositionMutation: Math.PI / 5,
    maxColorMutation: 10,
    maxLineWidthMutation: 2,
    maxSpeedMutation: 1,
};

export function mutatePainting(painting: Painting, mode: Mode) {
    const iterations = Math.floor(Math.random() * config.maxMutationIterations);
    for (let i = 0; i < iterations; i++) {
        const path = painting.paths[Math.floor(Math.random() * painting.paths.length)];
        if (Math.random() < config.addPositionProbability && mode == "lines") {
            path.instructions.push(generatePositionInstruction());
        }
        if (Math.random() < config.addStrokeStyleProbability) {
            path.instructions.push(generateStrokeStyleInstruction());
        }
        if (Math.random() < config.addLineWidthProbability) {
            path.instructions.push(generateLineWidthInstruction());
        }
        if (Math.random() < config.addSpeedProbability) {
            path.instructions.push(generateSpeedInstruction());
        }
        if (Math.random() < config.addIconProbability && mode == "icons") {
            path.instructions.push(generateIconInstruction());
        }
        if (Math.random() < config.removeInstructionProbability && path.instructions.length > 1) {
            let index = Math.floor(Math.random() * path.instructions.length - 1) + 1;
            path.instructions.splice(index, 1);
        }
        if (Math.random() < config.mutateInstructionProbability) {
            const randomInstruction = path.instructions[Math.floor(Math.random() * path.instructions.length)];
            instructionMutators[randomInstruction.type](randomInstruction);
        }
        // TODO: maybe remodel to have multiple paths?
        if (Math.random() < config.startNewPathProbability) {
            painting.paths.push({
                instructions: [
                    // TODO: refactor canvas width out
                    generateBeginInstruction(400, 400),
                    generatePositionInstruction(),
                ]
            })
        }
        if (Math.random() < config.removePathProbability && painting.paths.length > 1) {
            painting.paths.splice(Math.floor(Math.random() * painting.paths.length), 1);
        }
    }

}

export function mutateBeginInstruction(instruction: Instruction) {
// I don't really want to implement this right now :)
}

export function mutateStrokeStyleInstruction(instruction: Instruction) {
    instruction.args.r *= Math.random() + 0.5;
    instruction.args.r = norm(instruction.args.r, -config.maxColorMutation, config.maxColorMutation);
    instruction.args.g *= Math.random() + 0.5;
    instruction.args.g = norm(instruction.args.g, -config.maxColorMutation, config.maxColorMutation);
    instruction.args.b *= Math.random() + 0.5;
    instruction.args.b = norm(instruction.args.b, -config.maxColorMutation, config.maxColorMutation);
}

export function mutatePositionInstruction(instruction: Instruction) {
    const mutationAmount = Math.random() * config.maxPositionMutation * 2 - config.maxPositionMutation;
    instruction.args.angle = wrap(instruction.args.angle + mutationAmount, 0, Math.PI * 2);
}

function mutateLineWidthInstruction(instruction: Instruction) {
    const mutationAmount = Math.random() * config.maxLineWidthMutation * 2 - config.maxLineWidthMutation;
    instruction.args.amount = norm(instruction.args.amount + mutationAmount, -config.maxLineWidthMutation, config.maxLineWidthMutation);
}

function mutateSpeedInstruction(instruction: Instruction) {
    const mutationAmount = Math.random() * config.maxSpeedMutation * 2 - config.maxSpeedMutation;
    instruction.args.amount = norm(instruction.args.amount + mutationAmount, -config.maxSpeedMutation, config.maxSpeedMutation);
}

export function clone<T>(item: T): T {
    return JSON.parse(JSON.stringify(item));
}

