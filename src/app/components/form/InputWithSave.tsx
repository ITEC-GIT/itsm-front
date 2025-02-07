const InputWithSave = ({
  value,
  onChange,
  onClick,
}: {
  value: string;
  onChange: any;
  onClick: any;
}) => {
  return (
    <div style={{ width: "100%", maxWidth: "250px" }}>
      <div className="input-group">
        <input
          type="text"
          className="form-control custom-input-save"
          placeholder="..."
          value={value}
          onChange={onChange}
          aria-label="Save"
          aria-describedby="save-icon"
        />
        <span
          className="input-group-text custom-input-save save-span"
          id="save-icon"
          onClick={onClick}
        >
          <i className="bi bi-download save-icon"></i>
        </span>
      </div>
    </div>
  );
};

export { InputWithSave };
