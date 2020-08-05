import { Instruction } from "./pathbuilder";

export interface Painting {
    paths: Path[];
}

export interface Path {
    instructions: Instruction[];
}