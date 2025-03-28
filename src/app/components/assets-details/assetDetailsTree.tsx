import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Handle, Position, ReactFlow } from "reactflow";
import { Monitor, Keyboard, MousePointer, MonitorCog } from "lucide-react";
import "reactflow/dist/style.css";

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
    data: { label: "Keyboard", type: "Keyboard" },
    parent: 1,
  },
  {
    id: 6,
    type: "customNode",
    data: { label: "Mouse", type: "Mouse" },
    parent: 1,
  },
  {
    id: 7,
    type: "customNode",
    data: { label: "Keyboard", type: "Keyboard" },
    parent: 1,
  },
  {
    id: 8,
    type: "customNode",
    data: { label: "Monitor", type: "Monitor" },
    parent: 1,
  },
  {
    id: 9,
    type: "customNode",
    data: { label: "Keyboard", type: "Keyboard" },
    parent: 1,
  },
  {
    id: 10,
    type: "customNode",
    data: { label: "Keyboard", type: "Keyboard" },
    parent: 1,
  },
  {
    id: 11,
    type: "customNode",
    data: { label: "Mouse", type: "Mouse" },
    parent: 1,
  },
  { id: 12, type: "customNode", data: { label: "PC", type: "PC" }, parent: 1 },
  {
    id: 13,
    type: "customNode",
    data: { label: "Mouse", type: "Mouse" },
    parent: 1,
  },
  { id: 14, type: "customNode", data: { label: "PC", type: "PC" }, parent: 1 },
  {
    id: 15,
    type: "customNode",
    data: { label: "Monitor", type: "Monitor" },
    parent: 1,
  },
  { id: 16, type: "customNode", data: { label: "PC", type: "PC" }, parent: 1 },
  {
    id: 17,
    type: "customNode",
    data: { label: "Mouse", type: "Mouse" },
    parent: 1,
  },
  {
    id: 18,
    type: "customNode",
    data: { label: "Monitor", type: "Monitor" },
    parent: 1,
  },
  { id: 19, type: "customNode", data: { label: "PC", type: "PC" }, parent: 1 },
  {
    id: 20,
    type: "customNode",
    data: { label: "Mouse", type: "Mouse" },
    parent: 1,
  },
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
  const [divWidth, setDivWidth] = useState<number>(800);

  useEffect(() => {
    if (!divRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      setDivWidth(Math.round(rect.width));
    });
    observer.observe(divRef.current);
    if (divRef.current) {
      setDivWidth(divRef.current.offsetWidth);
    }

    return () => observer.disconnect();
  }, []);

  const calculatePositions = useCallback(() => {
    const parentNodes = dynamicNodes.filter((node) => !node.parent);
    const childNodes = dynamicNodes.filter((node) => node.parent !== null);
    const NODE_WIDTH = 100;
    const HORIZONTAL_GAP = 50;
    const VERTICAL_GAP = 120;

    const positionedParents = parentNodes.map((node) => ({
      ...node,
      id: node.id.toString(),
      parent: null,
      position: {
        x: divWidth / 2 - NODE_WIDTH / 2,
        y: 50,
      },
    }));

    const childrenByParent: Record<string, typeof childNodes> = {};
    childNodes.forEach((node) => {
      const parentId = String(node.parent);
      if (!childrenByParent[parentId]) {
        childrenByParent[parentId] = [];
      }
      childrenByParent[parentId].push(node);
    });

    const positionedChildren: Node[] = [];

    Object.entries(childrenByParent).forEach(([parentId, children]) => {
      const parent = positionedParents.find((p) => p.id === parentId);
      if (!parent) return;

      const maxNodesPerRow = Math.max(
        1,
        Math.floor(divWidth / (NODE_WIDTH + HORIZONTAL_GAP))
      );
      const totalRows = Math.ceil(children.length / maxNodesPerRow);

      children.forEach((child, index) => {
        const row = Math.floor(index / maxNodesPerRow);
        const col = index % maxNodesPerRow;

        const nodesInRow = Math.min(
          maxNodesPerRow,
          children.length - row * maxNodesPerRow
        );
        const rowWidth =
          nodesInRow * NODE_WIDTH + (nodesInRow - 1) * HORIZONTAL_GAP;
        const rowStartX = parent.position.x + NODE_WIDTH / 2 - rowWidth / 2;

        positionedChildren.push({
          ...child,
          id: child.id.toString(),
          parent: parentId,
          position: {
            x: rowStartX + col * (NODE_WIDTH + HORIZONTAL_GAP),
            y: parent.position.y + VERTICAL_GAP + row * VERTICAL_GAP * 0.8,
          },
        });
      });
    });

    const generatedEdges = childNodes.map((child) => ({
      id: `edge-${child.parent}-${child.id}`,
      source: String(child.parent),
      target: String(child.id),
      type: "smoothstep",
      style: { stroke: "#007bff", strokeWidth: 2 },
      markerEnd: { type: "arrowclosed", color: "#007bff" },
    }));

    return {
      nodes: [...positionedParents, ...positionedChildren],
      edges: generatedEdges,
    };
  }, [divWidth]);

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
        fitViewOptions={{ padding: 0.5 }}
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
