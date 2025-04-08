import React, { useState, useEffect, useRef, useCallback } from "react";
import { TableColumn } from "react-data-table-component";

interface ColumnsModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: TableColumn<T>[];
  initialVisibility: { [key: string]: boolean };
  onVisibilityChange: (visibility: { [key: string]: boolean }) => void;
}

const ColumnsModal = <T,>({
  isOpen,
  onClose,
  columns,
  initialVisibility,
  onVisibilityChange,
  buttonRef,
}: ColumnsModalProps<T> & {
  buttonRef: React.RefObject<HTMLButtonElement>;
}) => {
  const [columnsVisibility, setColumnsVisibility] = useState(initialVisibility);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  const toggleColumnsVisibility = (columnId: string) => {
    setColumnsVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnId]: !prevVisibility[columnId],
    }));
  };

  const toggleSelectAll = () => {
    const allSelected = Object.values(columnsVisibility).every(
      (visibility) => visibility
    );

    const newVisibility = columns.reduce((acc, col) => {
      acc[col.id as string] = !allSelected;
      return acc;
    }, {} as Record<string, boolean>);

    newVisibility["action"] = true;
    setColumnsVisibility(newVisibility);
  };

  useEffect(() => {
    setColumnsVisibility(initialVisibility);
  }, [initialVisibility]);

  useEffect(() => {
    onVisibilityChange(columnsVisibility);
  }, [columnsVisibility, onVisibilityChange]);

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      });
    }
  }, [buttonRef]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition);
    }

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="dropdown-menu p-4 show column-modal-dropdown"
      style={{
        position: "absolute",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
        minWidth: "200px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-dark fw-bold mb-0">Columns Visibility</h5>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      </div>
      <div className="mb-3">
        <hr className="dropdown-divider" />
      </div>
      <div className="d-flex flex-column">
        <label className="column-modal-dropdown-item">
          <input
            type="checkbox"
            checked={Object.values(columnsVisibility).every(
              (visibility) => visibility
            )}
            onChange={toggleSelectAll}
            className="column-modal-dropdown-checkbox"
          />
          <span className="column-modal-dropdown-label">Select All</span>
        </label>
        <div className="mb-3">
          <hr className="dropdown-divider" />
        </div>
        <div className="column-modal-list">
          {columns.map((col) => (
            <label key={col.id} className="column-modal-dropdown-item">
              <input
                type="checkbox"
                checked={columnsVisibility[col.id as string]}
                onChange={() => toggleColumnsVisibility(col.id as string)}
                className="column-modal-dropdown-checkbox"
              />
              <span className="column-modal-dropdown-label">{col.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColumnsModal;
