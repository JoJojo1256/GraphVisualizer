import { Proof } from "@/types/graph";

export const longestPathCycleProof: Proof = {
  id: "longest-path-cycle",
  title: "Longest Path and Cycle Theorem",
  description:
    "Every graph G contains a path of length δ(G) and a cycle of length at least δ(G) + 1 (provided that δ(G) ≥ 2).",
  steps: [
    {
      title: "Choose vertex x₀ (an endpoint of the longest path)",
      description: "We just have one vertex",
      graphState: {
        vertices: [{ id: "x0", label: "x₀", x: 100, y: 200 }],
        edges: [],
      },
    },
    {
      title: "Initial Path",
      description: "Start with a path from x₀ to xₖ",
      graphState: {
        vertices: [
          { id: "x0", label: "x₀", x: 100, y: 200 },
          { id: "x1", label: "", x: 160, y: 200 },
          { id: "xi", label: "xᵢ", x: 220, y: 200 },
          { id: "x3", label: "", x: 280, y: 200 },
          { id: "x4", label: "", x: 340, y: 200 },
          { id: "x5", label: "", x: 400, y: 200 },
          { id: "xk", label: "xₖ", x: 460, y: 200 },
        ],
        edges: [
          { id: "e1", from: "x0", to: "x1" },
          { id: "e2", from: "x1", to: "xi" },
          { id: "e3", from: "xi", to: "x3" },
          { id: "e4", from: "x3", to: "x4" },
          { id: "e5", from: "x4", to: "x5" },
          { id: "e6", from: "x5", to: "xk" },
        ],
      },
    },
    {
      title: "Highlight Endpoint",
      description: "Highlight the endpoint xₖ",
      graphState: {
        vertices: [
          { id: "x0", label: "x₀", x: 100, y: 200 },
          { id: "x1", label: "", x: 160, y: 200 },
          { id: "xi", label: "xᵢ", x: 220, y: 200 },
          { id: "x3", label: "", x: 280, y: 200 },
          { id: "x4", label: "", x: 340, y: 200 },
          { id: "x5", label: "", x: 400, y: 200 },
          { id: "xk", label: "xₖ", x: 460, y: 200, highlighted: true },
        ],
        edges: [
          { id: "e1", from: "x0", to: "x1" },
          { id: "e2", from: "x1", to: "xi" },
          { id: "e3", from: "xi", to: "x3" },
          { id: "e4", from: "x3", to: "x4" },
          { id: "e5", from: "x4", to: "x5" },
          { id: "e6", from: "x5", to: "xk" },
        ],
      },
    },
    {
      title: "Introduce Vertex v",
      description: "Introduce imaginary vertex v with dashed edge",
      graphState: {
        vertices: [
          { id: "x0", label: "x₀", x: 100, y: 200 },
          { id: "x1", label: "", x: 160, y: 200 },
          { id: "xi", label: "xᵢ", x: 220, y: 200 },
          { id: "x3", label: "", x: 280, y: 200 },
          { id: "x4", label: "", x: 340, y: 200 },
          { id: "x5", label: "", x: 400, y: 200 },
          { id: "xk", label: "xₖ", x: 460, y: 200, highlighted: true },
          { id: "v", label: "v", x: 460, y: 100, opacity: 0.5 },
        ],
        edges: [
          { id: "e1", from: "x0", to: "x1" },
          { id: "e2", from: "x1", to: "xi" },
          { id: "e3", from: "xi", to: "x3" },
          { id: "e4", from: "x3", to: "x4" },
          { id: "e5", from: "x4", to: "x5" },
          { id: "e6", from: "x5", to: "xk" },
          { id: "e7", from: "xk", to: "v", dashed: true, opacity: 0.5 },
        ],
      },
    },
    {
      title: "Introduce Vertex v",
      description: "Introduce imaginary vertex v with dashed edge",
      graphState: {
        vertices: [
          { id: "x0", label: "x₀", x: 100, y: 200 },
          { id: "x1", label: "", x: 160, y: 200 },
          { id: "xi", label: "xᵢ", x: 220, y: 200 },
          { id: "x3", label: "", x: 280, y: 200 },
          { id: "x4", label: "", x: 340, y: 200 },
          { id: "x5", label: "", x: 400, y: 200 },
          { id: "xk", label: "xₖ", x: 460, y: 200, highlighted: true },
        ],
        edges: [
          { id: "e1", from: "x0", to: "x1" },
          { id: "e2", from: "x1", to: "xi" },
          { id: "e3", from: "xi", to: "x3" },
          { id: "e4", from: "x3", to: "x4" },
          { id: "e5", from: "x4", to: "x5" },
          { id: "e6", from: "x5", to: "xk" },
        ],
      },
    },
    {
      title: "Show Edges to Earlier Vertices",
      description:
        "Demonstrate that xₖ is connected to earlier vertices in the path",
      graphState: {
        vertices: [
          { id: "x0", label: "x₀", x: 100, y: 200 },
          { id: "x1", label: "", x: 160, y: 200 },
          { id: "xi", label: "xᵢ", x: 220, y: 200 },
          { id: "x3", label: "", x: 280, y: 200 },
          { id: "x4", label: "", x: 340, y: 200 },
          { id: "x5", label: "", x: 400, y: 200 },
          { id: "xk", label: "xₖ", x: 460, y: 200, highlighted: true },
        ],
        edges: [
          { id: "e1", from: "x0", to: "x1" },
          { id: "e2", from: "x1", to: "xi" },
          { id: "e3", from: "xi", to: "x3" },
          { id: "e4", from: "x3", to: "x4" },
          { id: "e5", from: "x4", to: "x5" },
          { id: "e6", from: "x5", to: "xk" },
          { id: "c1", from: "xk", to: "xi", curvature: 150, highlighted: true },
          { id: "c2", from: "xk", to: "x3", curvature: 120 },
          { id: "c3", from: "xk", to: "x4", curvature: 90 },
        ],
      },
    },
    {
      title: "Cycle Making",
      description:
        "Demonstrate that xₖ is connected to earlier vertices in the path",
      graphState: {
        vertices: [
          { id: "x0", label: "x₀", x: 100, y: 200 },
          { id: "x1", label: "", x: 160, y: 200 },
          { id: "xi", label: "xᵢ", x: 220, y: 200 },
          { id: "x3", label: "", x: 280, y: 200 },
          { id: "x4", label: "", x: 340, y: 200 },
          { id: "x5", label: "", x: 400, y: 200 },
          { id: "xk", label: "xₖ", x: 460, y: 200, highlighted: true },
        ],
        edges: [
          { id: "e1", from: "x0", to: "x1" },
          { id: "e2", from: "x1", to: "xi" },
          { id: "e3", from: "xi", to: "x3", highlighted: true },
          { id: "e4", from: "x3", to: "x4", highlighted: true },
          { id: "e5", from: "x4", to: "x5", highlighted: true },
          { id: "e6", from: "x5", to: "xk", highlighted: true },
          { id: "c1", from: "xk", to: "xi", curvature: 150, highlighted: true },
          { id: "c2", from: "xk", to: "x3", curvature: 120 },
          { id: "c3", from: "xk", to: "x4", curvature: 90 },
        ],
      },
    },
  ],
  completed: false,
};
