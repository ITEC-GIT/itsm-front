import React, { useState, useEffect, useRef } from "react";
import { TableColumn } from "react-data-table-component";

interface ColumnModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  columns: TableColumn<T>[];
  initialVisibility: { [key: string]: boolean };
  onVisibilityChange: (visibility: { [key: string]: boolean }) => void;
}

const ColumnModal = <T,>({
  isOpen,
  onClose,
  columns,
  initialVisibility,
  onVisibilityChange,
}: ColumnModalProps<T>) => {
  const [columnVisibility, setColumnVisibility] = useState(initialVisibility);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setColumnVisibility(initialVisibility);
  }, [initialVisibility]);

  useEffect(() => {
    onVisibilityChange(columnVisibility);
  }, [columnVisibility, onVisibilityChange]);

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnId]: !prevVisibility[columnId],
    }));
  };

  const toggleSelectAll = () => {
    const allSelected = Object.values(columnVisibility).every(
      (visibility) => visibility
    );
    const newVisibility = columns.reduce((acc, col) => {
      acc[col.id as string] = !allSelected;
      return acc;
    }, {} as Record<string, boolean>);
    setColumnVisibility(newVisibility);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="dropdown-menu p-4 show column-modal-dropdown"
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
            checked={Object.values(columnVisibility).every(
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
                checked={columnVisibility[col.id as string]}
                onChange={() => toggleColumnVisibility(col.id as string)}
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

export default ColumnModal;
