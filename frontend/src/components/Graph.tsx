import { motion, AnimatePresence } from "framer-motion";
import { Edge, Vertex } from "../types/graph";
import { useEffect, useState, useRef } from "react";

interface GraphProps {
  vertices: Vertex[];
  edges: Edge[];
}

const Graph = ({ vertices, edges }: GraphProps) => {
  const [visibleVertices, setVisibleVertices] = useState<string[]>([]);
  const [visibleEdges, setVisibleEdges] = useState<string[]>([]);
  const previousVertices = useRef<string[]>([]);
  const previousEdges = useRef<string[]>([]);

  useEffect(() => {
    // Find new and removed vertices
    const newVertices = vertices
      .map((v) => v.id)
      .filter((id) => !previousVertices.current.includes(id));

    const removedVertices = previousVertices.current.filter(
      (id) => !vertices.map((v) => v.id).includes(id)
    );
    console.log(newVertices);
    console.log(previousVertices.current);

    // Find new and removed edges
    const newEdges = edges
      .map((e) => e.id)
      .filter((id) => !previousEdges.current.includes(id));
    console.log(newEdges);
    const removedEdges = previousEdges.current.filter(
      (id) => !edges.map((e) => e.id).includes(id)
    );
    console.log(removedEdges);
    // Handle removed elements with exit animations
    removedVertices.forEach((vertexId) => {
      setTimeout(() => {
        setVisibleVertices((prev) => prev.filter((id) => id !== vertexId));
      }, 0);
    });

    removedEdges.forEach((edgeId) => {
      setTimeout(() => {
        setVisibleEdges((prev) => prev.filter((id) => id !== edgeId));
      }, 0);
    });

    // Keep track of what we've shown before
    previousVertices.current = vertices.map((v) => v.id);
    previousEdges.current = edges.map((e) => e.id);

    // Create a sequence of vertex-edge pairs for new elements
    const sequence = newVertices.map((vertexId, index) => {
      const connectedEdge = newEdges.find((edgeId) => {
        const edge = edges.find((e) => e.id === edgeId);
        return edge && (edge.from === vertexId || edge.to === vertexId);
      });

      return { vertexId, edgeId: connectedEdge };
    });

    // Add any remaining new edges that weren't included in the vertex sequence
    const remainingEdges = newEdges.filter(
      (edgeId) => !sequence.some((item) => item.edgeId === edgeId)
    );

    // Combine vertex sequence with remaining edges
    const fullSequence = [
      ...sequence,
      ...remainingEdges.map((edgeId) => ({ vertexId: null, edgeId })),
    ];

    // Animate new elements with shorter delays
    fullSequence.forEach(({ vertexId, edgeId }, index) => {
      if (vertexId) {
        setTimeout(() => {
          setVisibleVertices((prev) => [...prev, vertexId]);
        }, index * 600);
      }

      if (edgeId) {
        setTimeout(() => {
          setVisibleEdges((prev) => [...prev, edgeId]);
        }, index * 600 + 250);
      }
    });
  }, [vertices, edges]);

  return (
    <svg className="w-full h-full" viewBox="0 0 600 400">
      {/* Render edges */}
      <AnimatePresence>
        {edges.map((edge) => {
          const fromVertex = vertices.find((v) => v.id === edge.from);
          const toVertex = vertices.find((v) => v.id === edge.to);

          if (!fromVertex || !toVertex) return null;

          const isNew = !previousEdges.current.includes(edge.id);
          const fromVertexVisible = visibleVertices.includes(edge.from);
          const toVertexVisible = visibleVertices.includes(edge.to);
          const shouldShowEdge = isNew ? visibleEdges.includes(edge.id) : true;


          const createCurvedPath = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            curvature: number = 50
          ) => {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const controlX = x1 + dx * 0.5;
            const controlY = y1 - curvature;
            return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
          };

          const createDashedPath = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            dashLength: number = 10,
            gapLength: number = 10
          ) => {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const numDashes = Math.floor(length / (dashLength + gapLength));
            const pathSegments = [];

            for (let i = 0; i < numDashes; i++) {
              const start = i * (dashLength + gapLength);
              const end = start + dashLength;
              const startX = x1 + (dx * start) / length;
              const startY = y1 + (dy * start) / length;
              const endX = x1 + (dx * end) / length;
              const endY = y1 + (dy * end) / length;
              pathSegments.push(`M ${startX} ${startY} L ${endX} ${endY}`);
            }

            return pathSegments.join(" ");
          };

          const path = edge.dashed
            ? createDashedPath(
                fromVertex.x,
                fromVertex.y,
                toVertex.x,
                toVertex.y
              )
            : typeof edge.curvature === "number"
            ? createCurvedPath(
                fromVertex.x,
                fromVertex.y,
                toVertex.x,
                toVertex.y,
                edge.curvature
              )
            : `M ${fromVertex.x} ${fromVertex.y} L ${toVertex.x} ${toVertex.y}`;

          return (
            <motion.path
              key={edge.id}
              d={path}
              fill="none"
              stroke={edge.highlighted ? "#3b82f6" : "#64748b"}
              strokeWidth={edge.highlighted ? 3 : 2}
              strokeDasharray={edge.dashed ? "5,3" : "none"}
              opacity={edge.opacity ?? 1}
              initial={
                isNew
                  ? { pathLength: 0, opacity: 0 }
                  : { pathLength: 1, opacity: 1 }
              }
              animate={{
                pathLength:
                  shouldShowEdge && fromVertexVisible && toVertexVisible
                    ? 1
                    : 0,
                opacity:
                  shouldShowEdge && fromVertexVisible && toVertexVisible
                    ? 1
                    : 0,
              }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{
                duration: 0.3, // Reduced from 0.5
                pathLength: {
                  type: "spring",
                  stiffness: 200, // Increased from 100
                  damping: 20,
                  mass: 1,
                },
              }}
            />
          );
        })}
      </AnimatePresence>

      {/* Render vertices */}
      <AnimatePresence>
        {vertices.map((vertex) => {
          const isNew = !previousVertices.current.includes(vertex.id);

          return (
            <motion.g
              key={vertex.id}
              initial={
                isNew ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }
              }
              animate={{
                scale: isNew
                  ? visibleVertices.includes(vertex.id)
                    ? 1
                    : 0
                  : 1,
                opacity: isNew
                  ? visibleVertices.includes(vertex.id)
                    ? 1
                    : 0
                  : 1,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }} // Reduced from 0.3
            >
              <motion.circle
                cx={vertex.x}
                cy={vertex.y}
                r={20}
                fill={
                  vertex.color || (vertex.highlighted ? "#3b82f6" : "#94a3b8")
                }
                opacity={vertex.opacity ?? 1}
              />
              <text
                x={vertex.x}
                y={vertex.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                {vertex.label}
              </text>
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
};

export default Graph;
