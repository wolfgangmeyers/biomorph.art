import * as d3 from "d3-color";

import { Painting } from "./model";
import { Instruction, InstructionType } from "./pathbuilder";
import { norm, wrap } from "./norm";

const instructionTypes: InstructionType[] = [
    "strokeStyle",
    "position",
    "lineWidth",
    "speed"
];

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

export function generateRandomInstruction(): Instruction {
    const instructionType = instructionTypes[Math.floor(Math.random() * instructionTypes.length)];
    return instructionGenerators[instructionType]();
}

const instructionGenerators = {
    "strokeStyle": generateStrokeStyleInstruction,

    // stubes
    "position": generatePositionInstruction,
    "lineWidth": generateLineWidthInstruction,
    "speed": generateSpeedInstruction,
}

const instructionMutators = {
    "strokeStyle": mutateStrokeStyleInstruction,
    "position": mutatePositionInstruction,
    "begin": mutateBeginInstruction,
    "lineWidth": mutateBeginInstruction,
    "speed": mutateBeginInstruction,
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
    maxMutationIterations: 100,
    addPositionProbability: 0.3,
    addStrokeStyleProbability: 0.1,
    addSpeedProbability: 0.3,
    addLineWidthProbability: 0.1,
    mutateInstructionProbability: 0.3,
    removeInstructionProbability: 0.3,

    maxPositionMutation: Math.PI / 5,
    maxColorMutation: 10,
    maxLineWidthMutation: 2,
    maxSpeedMutation: 1,
};

export function mutatePainting(painting: Painting) {
    const iterations = Math.floor(Math.random() * config.maxMutationIterations);
    for (let i = 0; i < iterations; i++) {
        if (Math.random() < config.addPositionProbability) {
            painting.instructions.push(generatePositionInstruction());
        }
        if (Math.random() < config.addStrokeStyleProbability) {
            painting.instructions.push(generateStrokeStyleInstruction());
        }
        if (Math.random() < config.addLineWidthProbability) {
            painting.instructions.push(generateLineWidthInstruction());
        }
        if (Math.random() < config.addSpeedProbability) {
            painting.instructions.push(generateSpeedInstruction());
        }
        if (Math.random() < config.removeInstructionProbability && painting.instructions.length > 1) {
            let index = Math.floor(Math.random() * painting.instructions.length - 1) + 1;
            painting.instructions.splice(index, 1);
        }
        if (Math.random() < config.mutateInstructionProbability) {
            const randomInstruction = painting.instructions[Math.floor(Math.random() * painting.instructions.length)];
            instructionMutators[randomInstruction.type](randomInstruction);
        }
    }

}

export function mutateBeginInstruction(instruction: Instruction) {
// I don't really want to implement this right now :)
}

export function mutateStrokeStyleInstruction(instruction: Instruction) {
    instruction.args.r *= Math.random() + 0.5;
    instruction.args.r = norm(instruction.args.r, 0, config.maxColorMutation);
    instruction.args.g *= Math.random() + 0.5;
    instruction.args.g = norm(instruction.args.g, 0, config.maxColorMutation);
    instruction.args.b *= Math.random() + 0.5;
    instruction.args.b = norm(instruction.args.b, 0, config.maxColorMutation);
}

export function mutatePositionInstruction(instruction: Instruction) {
    const mutationAmount = Math.random() * config.maxPositionMutation * 2 - config.maxPositionMutation;
    instruction.args.angle = wrap(instruction.args.angle + mutationAmount, 0, Math.PI * 2);
}


export function clone<T>(item: T): T {
    return JSON.parse(JSON.stringify(item));
}

