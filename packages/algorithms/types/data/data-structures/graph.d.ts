import { default as Dictionary } from './dictionary';
export default class Graph {
    private isDirected;
    private vertices;
    private adjList;
    constructor(isDirected?: boolean);
    addVertex(v: string | number): void;
    addEdge(a: string | number, b: string | number): void;
    getVertices(): (string | number)[];
    getAdjList(): Dictionary<string | number, (string | number)[]>;
    toString(): string;
}
