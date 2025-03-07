import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { throttle } from "./throttle";

type Position = { x: number; y: number };
type OnDrag = (position: Position) => Position;

const id = <T>(x: T): T => x;

const useDraggable = ({ onDrag = id }: { onDrag?: OnDrag } = {}) => {
  const [pressed, setPressed] = useState(false);

  const position = useRef<Position>({ x: 0, y: 0 });
  const ref = useRef<HTMLElement | null>(null);

  const unsubscribe = useRef<() => void>();

  const legacyRef = useCallback((elem: HTMLElement | null) => {
    ref.current = elem;
    if (unsubscribe.current) {
      unsubscribe.current();
    }
    if (!elem) {
      return;
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.style.userSelect = "none";
      }
      setPressed(true);
    };

    elem.addEventListener("mousedown", handleMouseDown);
    unsubscribe.current = () => {
      elem.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (!pressed) {
      return;
    }

    const handleMouseMove = throttle((event: MouseEvent) => {
      if (!ref.current || !position.current) {
        return;
      }

      const pos = position.current;
      const elem = ref.current;

      position.current = onDrag({
        x: pos.x + event.movementX,
        y: pos.y + event.movementY,
      });

      elem.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
    });

    const handleMouseUp = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        e.target.style.userSelect = "auto";
      }
      setPressed(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      handleMouseMove.cancel();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [pressed, onDrag]);

  return [legacyRef, pressed] as const;
};

export default useDraggable;
