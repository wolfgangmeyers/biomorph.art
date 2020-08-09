export function mutationAmount(): number {
    return parseInt((<HTMLInputElement>document.getElementById("mutationAmount")).value);
}

export function colorMutationProbability(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("colorMutationProbability")).value);
}

export function speedMutationProbability(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("speedMutationProbability")).value);
}

export function lineWidthMutationProbability(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("lineWidthMutationProbability")).value);
}

export function lineMutationProbability(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("lineMutationProbability")).value);
}

export function iconMutationProbability(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("iconMutationProbability")).value);
}

export function deleteInstructionProbability(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("deleteInstructionProbability")).value);
}

export function newPathProbability(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("newPathProbability")).value);
}

export function deletePathProbability(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("deletePathProbability")).value);
}

export function maxLineWidthMutation(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("maxLineWidthMutation")).value);
}

export function maxLineWidth(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("maxLineWidth")).value);
}

export function maxSpeed(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("maxSpeed")).value);
}

export function maxSpeedMutation(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("maxSpeedMutation")).value);
}