const DatePicker = ({
  date,
  setDate,
}: {
  date: string;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  return (
    <div className="mb-3">
      <input
        type="date"
        className="form-control custom-date-input"
        id="date"
        value={date}
        onChange={handleDateChange}
      />
    </div>
  );
};

export { DatePicker };
