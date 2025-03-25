import { Handle, Position, ReactFlow } from "reactflow";
import { Monitor, Keyboard, MousePointer, MonitorCog } from "lucide-react";
import "reactflow/dist/style.css";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";

const dynamicNodes = [
  {
    id: 1,
    type: "customNode",
    data: { label: "PC", type: "PC" },
    parent: null,
  },
  {
    id: 2,
    type: "customNode",
    data: { label: "Monitor", type: "Monitor" },
    parent: 1,
  },
  {
    id: 3,
    type: "customNode",
    data: { label: "Keyboard", type: "Keyboard" },
    parent: 1,
  },
  {
    id: 4,
    type: "customNode",
    data: { label: "Mouse", type: "Mouse" },
    parent: 1,
  },
  {
    id: 5,
    type: "customNode",
    data: { label: "PC", type: "PC" },
    parent: 1,
  },
  {
    id: 6,
    type: "customNode",
    data: { label: "Mouse", type: "Mouse" },
    parent: 1,
  },
  { id: 7, type: "customNode", data: { label: "PC", type: "PC" }, parent: 1 },
];

const CustomNode = ({ data }: any) => {
  const { label, type } = data;

  const getIcon = () => {
    switch (type) {
      case "PC":
        return <MonitorCog size={30} color="#007bff" />;
      case "Monitor":
        return <Monitor size={30} color="#007bff" />;
      case "Keyboard":
        return <Keyboard size={30} color="#007bff" />;
      case "Mouse":
        return <MousePointer size={30} color="#007bff" />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: "white",
          boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #007bff",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => data.onClick && data.onClick(data)}
      >
        {getIcon()}
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: "#007bff", width: 8, height: 8 }}
        />
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: "#007bff", width: 8, height: 8 }}
        />
      </div>

      <div
        style={{
          fontSize: 12,
          marginTop: 5,
          fontWeight: "bold",
          color: "#333",
        }}
      >
        {label}
      </div>
    </div>
  );
};

type NodeData = {
  label: string;
  type: string;
};

type Node = {
  id: string;
  type: string;
  data: NodeData;
  position: { x: number; y: number };
  parent: string | null;
};

type Edge = {
  id: string;
  source: string;
  target: string;
};

const AssetsTree = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const divRef = useRef<HTMLDivElement>(null);
  const [divWidth, setDivWidth] = useState<number | null>(null);

  useEffect(() => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      setDivWidth(Math.round(rect.width));
    }
  }, [divRef.current]);

  const calculatePositions = useCallback(() => {
    const parentNodes = dynamicNodes.filter((node) => !node.parent);
    const childNodes = dynamicNodes.filter((node) => node.parent !== null);

    // Config
    const NODE_WIDTH = 100;
    const HORIZONTAL_GAP = 50;
    const VERTICAL_GAP = 120;

    // Calculate max nodes per row based on container width
    const maxNodesPerRow = Math.max(
      1,
      Math.floor((divWidth ?? 0) / (NODE_WIDTH + HORIZONTAL_GAP))
    );

    // Position parents in a grid (wrap to new row if needed)
    const positionedParents = parentNodes.map((node, index) => {
      const row = Math.floor(index / maxNodesPerRow);
      const col = index % maxNodesPerRow;
      return {
        ...node,
        id: node.id.toString(),
        parent: null,
        position: {
          x: col * (NODE_WIDTH + HORIZONTAL_GAP),
          y: row * VERTICAL_GAP,
        },
      };
    });

    // Position children under their parents (vertically stacked)
    const positionedChildren = childNodes.map((node) => {
      const parent = positionedParents.find(
        (p) => p.id === String(node.parent)
      );
      const siblings = childNodes.filter((n) => n.parent === node.parent);
      const siblingIndex = siblings.findIndex((n) => n.id === node.id);

      return {
        ...node,
        id: node.id.toString(),
        parent: node.parent?.toString(),
        position: {
          x:
            (parent?.position.x ?? 0) +
            siblingIndex * (NODE_WIDTH + HORIZONTAL_GAP / 2),
          y: (parent?.position.y ?? 0) + VERTICAL_GAP,
        },
      };
    });

    // Generate edges
    const generatedEdges = childNodes.map((node) => ({
      id: `e${node.parent}-${node.id}`,
      source: String(node.parent),
      target: String(node.id),
    }));

    return {
      nodes: [...positionedParents, ...positionedChildren],
      edges: generatedEdges,
    };
  }, [divRef.current]);

  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = calculatePositions();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [calculatePositions]);

  const memoizedNodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  return (
    <div
      ref={divRef}
      style={{ width: "100%", height: "600px", padding: "5px" }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={memoizedNodeTypes}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        panOnDrag={false}
        nodesDraggable={false}
      />
    </div>
  );
};

export { AssetsTree };
