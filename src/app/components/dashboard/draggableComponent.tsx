import { cloneElement, useCallback } from "react";
import useDraggable from "./use-draggable";

interface DraggableComponentProps {
  children: React.ReactElement;
  key?: React.Key;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  children,
}) => {
  const handleDrag = useCallback(
    ({ x, y }: { x: number; y: number }) => ({
      x: Math.max(0, x),
      y: Math.max(0, y),
    }),
    []
  );

  const [ref, pressed] = useDraggable({
    onDrag: handleDrag,
  });

  //Clone the child element and attach the ref to it
  const draggableChild = cloneElement(children, {
    ref,
    style: {
      ...children.props.style,
      cursor: pressed ? "grabbing" : "grab", // Change cursor based on drag state
    },
  });

  return draggableChild;
};

export { DraggableComponent };
