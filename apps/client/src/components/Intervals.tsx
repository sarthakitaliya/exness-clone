const INTERVALS = ["1m", "5m", "15m", "30m", "1h", "1d"];

const IntervalDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (interval: string) => void;
}) => {
  return (
    <div className="p-2">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 text-gray-200 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        {INTERVALS.map((int) => (
          <option key={int} value={int}>
            {int}
          </option>
        ))}
      </select>
    </div>
  );
};

export default IntervalDropdown;