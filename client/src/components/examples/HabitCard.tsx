import HabitCard from "../HabitCard";

export default function HabitCardExample() {
  return (
    <div className="p-6 space-y-4 max-w-md">
      <HabitCard
        id={1}
        name="Morning Meditation"
        streak={12}
        progress={40}
        completedToday={true}
        onClick={() => console.log("Habit clicked")}
      />
      <HabitCard
        id={2}
        name="Read 30 Minutes"
        streak={7}
        progress={23}
        completedToday={null}
        onClick={() => console.log("Habit clicked")}
      />
      <HabitCard
        id={3}
        name="No Social Media"
        streak={5}
        progress={16}
        completedToday={false}
        onClick={() => console.log("Habit clicked")}
      />
    </div>
  );
}
