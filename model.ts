export interface PathBuilder {
    speed: number;
    strokeStyle: string;
    lineWidth: number;
    x: number;
    y: number;
    mode: Mode;
    scale: number;
}

export interface Instruction {
    type: InstructionType;
    args: any;
}
export type Mode = "lines" | "icons";
export type InstructionProcessor = (ctx: CanvasRenderingContext2D, builder: PathBuilder, args: any) => void;
export type InstructionType = "begin" | "strokeStyle" | "position" | "lineWidth" | "speed" | "end" | "icon";
export type InstructionProcessorSet = {[key: string]: InstructionProcessor};

export interface Painting {
    paths: Path[];
}

export interface Path {
    instructions: Instruction[];
}

