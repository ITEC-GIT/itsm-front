// ColumnModal.tsx
import React, { useState, useEffect } from "react";
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

  if (!isOpen) return null;

  return (
    <div
      className="dropdown-menu p-4 show column-modal-dropdown"
      style={{ top: "120%", left: 200, width: "300px" }}
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
  );
};

export default ColumnModal;
