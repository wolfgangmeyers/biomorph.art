export interface Painting {
    paths: Path[];
}

export interface Path {
    points: Point[];
    strokeStyle: string;
    lineWidth: number;
}

export interface Point {
    x: number;
    y: number;
}
