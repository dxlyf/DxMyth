import { default as Graph } from '../../data-structures/graph';
export declare const breadthFirstSearch: (graph: Graph, startVertex: any, callback: Function) => void;
export declare const bfs: (graph: Graph, startVertex: any) => {
    distances: any;
    predecessors: any;
};
