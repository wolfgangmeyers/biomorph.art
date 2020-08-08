export function mutationAmount(): number {
    return parseInt((<HTMLInputElement>document.getElementById("mutationAmount")).value);
}

export function colorMutationAmount(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("colorMutationProbability")).value);
}

export function speedMutationProbability(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("speedMutationProbability")).value);
}

export function lineWidthMutationProbability(): number {
    return parseFloat((<HTMLInputElement>document.getElementById("lineWidthMutationProbability")).value);
}