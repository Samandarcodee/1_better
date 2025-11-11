import HabitCalendar from "../HabitCalendar";

export default function HabitCalendarExample() {
  const mockDays = [
    { date: 1, status: "completed" as const },
    { date: 2, status: "completed" as const },
    { date: 3, status: "missed" as const },
    { date: 4, status: "completed" as const },
    { date: 5, status: "completed" as const },
    { date: 6, status: "completed" as const },
    { date: 7, status: "missed" as const },
    { date: 8, status: "completed" as const },
    { date: 9, status: "completed" as const },
    { date: 10, status: "completed" as const },
    { date: 11, status: "completed" as const },
    { date: 12, status: "completed" as const },
    { date: 13, status: "missed" as const },
    { date: 14, status: "today" as const },
    { date: 15, status: "future" as const },
    { date: 16, status: "future" as const },
    { date: 17, status: "future" as const },
    { date: 18, status: "future" as const },
    { date: 19, status: "future" as const },
    { date: 20, status: "future" as const },
    { date: 21, status: "future" as const },
  ];

  return (
    <div className="p-6 max-w-md">
      <HabitCalendar days={mockDays} />
    </div>
  );
}
