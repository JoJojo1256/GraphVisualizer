import { Proof } from "@/types/graph";
export const longestPathCycleProof: Proof = {
  id: 1,
  title: "Longest Path and Cycle Theorem",
  description:
    "Every graph G contains a path of length δ(G) and a cycle of length at least δ(G) + 1 (provided that δ(G) ≥ 2).",
  full_proof:
    "Let G be a graph with minimum degree δ(G) ≥ 2. Consider a longest path P = x₀, x₁, ..., xₖ in G. Since P is a longest path, xₖ has no neighbor outside of P; otherwise, the path could be extended, contradicting maximality. Let v be a neighbor of xₖ in G. Since δ(G) ≥ 2, xₖ must be connected to at least two vertices in P. Let v = xᵢ be the vertex on P with an edge to xₖ, where i < k. Then xᵢ, x_{i+1}, ..., xₖ, xᵢ forms a cycle. The length of this cycle is (k - i + 1) ≥ δ(G) + 1, because xₖ has at least δ(G) neighbors on the path, so the index i satisfies i ≤ k - δ(G). Thus, G contains a cycle of length at least δ(G) + 1. The path P itself has length k ≥ δ(G), since xₖ has δ(G) neighbors among x₀ to x_{k-1}.",
  steps: [
    {
      title: "Start with endpoint x₀",
      description:
        "Begin by placing vertex x₀, the starting point of a longest path.",
      graphState: {
        vertices: [{ id: "x0", label: "x₀", x: 100, y: 200 }],
        edges: [],
      },
    },
    {
      title: "Build the longest path P",
      description: "Construct a path P = x₀, x₁, ..., xₖ from x₀ to xₖ.",
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
      title: "Highlight endpoint xₖ",
      description: "Mark xₖ as the endpoint of the longest path P.",
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
      title: "Introduce possible neighbor v",
      description:
        "Add an imaginary vertex v to suggest a possible neighbor of xₖ.",
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
      title: "Back to longest path",
      description: "Return to the longest path before connecting to v.",
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
      title: "xₖ connects to earlier vertices",
      description:
        "Show that xₖ connects back to earlier vertices in the path, enabling a cycle.",
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
      title: "Form the cycle",
      description:
        "Highlight the cycle formed by going from xᵢ to xₖ and back to xᵢ.",
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
