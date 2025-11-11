import DurationChips from "../DurationChips";

export default function DurationChipsExample() {
  return (
    <div className="p-6">
      <DurationChips
        selected={21}
        onSelect={(duration) => console.log("Selected:", duration)}
      />
    </div>
  );
}
