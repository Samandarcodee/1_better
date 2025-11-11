import MiniLineChart from "../MiniLineChart";

export default function MiniLineChartExample() {
  const mockData = [
    { day: "Mon", value: 60 },
    { day: "Tue", value: 80 },
    { day: "Wed", value: 70 },
    { day: "Thu", value: 90 },
    { day: "Fri", value: 85 },
    { day: "Sat", value: 95 },
    { day: "Sun", value: 100 },
  ];

  return (
    <div className="p-6 max-w-md">
      <MiniLineChart data={mockData} />
    </div>
  );
}
