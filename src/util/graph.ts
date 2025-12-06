import type { Core as Graph } from 'cytoscape';

export const subGraphCount = (graph: Graph): number => {
  const visitedNodes = [...graph.nodes()];
  let counter = 0;
  while (visitedNodes.length > 0) {
    const start = visitedNodes.shift()!;
    graph.elements().bfs({
      roots: start,
      visit: (node) => {
        const index = visitedNodes.indexOf(node);
        if (index >= 0)
          visitedNodes.splice(index, 1);
      }
    });
    counter++;
  }
  return counter;
}