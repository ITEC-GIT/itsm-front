const DatetimePicker = ({
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
    <input
      type="datetime-local"
      className="form-control custom-date-input"
      id="date"
      value={date}
      onChange={handleDateChange}
    />
  );
};

export { DatetimePicker };
