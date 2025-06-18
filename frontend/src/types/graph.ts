export interface Vertex {
  id: string;
  label?: string;
  x: number;
  y: number;
  highlighted?: boolean;
  opacity?: number;
  color?: string;
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  highlighted?: boolean;
  dashed?: boolean;
  opacity?: number;
  curvature?: number;
}

export interface GraphState {
  vertices: Vertex[];
  edges: Edge[];
}

export interface ProofStep {
  title: string;
  description: string;
  graphState: GraphState;
}

export interface Proof {
  id: number;
  title: string;
  description: string;
  steps: ProofStep[];
  completed: Boolean;
}
