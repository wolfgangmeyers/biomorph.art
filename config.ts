export function mutationAmount(): number {
    return parseInt((<HTMLInputElement>document.getElementById("mutationAmount")).value);
}