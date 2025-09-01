const COINS = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

const DropDown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (symbol: string) => void;
}) => {
  return (
    <div className="flex gap-2 p-2">
      {COINS.map((coin) => (
        <button
          key={coin}
          onClick={() => onChange(coin)}
          className={`px-3 py-1 rounded-md text-sm ${
            value === coin
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {coin}
        </button>
      ))}
    </div>
  );
};

export default DropDown;