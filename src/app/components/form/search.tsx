const SearchComponent = ({
  value,
  onChange,
}: {
  value: string;
  onChange: any;
}) => {
  return (
    <div className="d-flex position-relative my-1">
      <div className="position-relative w-100">
        <i
          className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
          style={{ fontSize: "14px" }}
        ></i>
        <input
          type="text"
          className="form-control form-control-sm form-control-solid w-200px"
          name="Search"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search ..."
          style={{ paddingLeft: "35px" }}
        />
      </div>
    </div>
  );
};

export { SearchComponent };
