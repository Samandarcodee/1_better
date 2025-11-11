import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface MiniLineChartProps {
  data: { day: string; value: number }[];
}

export default function MiniLineChart({ data }: MiniLineChartProps) {
  return (
    <div className="w-full h-32 mt-6" data-testid="container-line-chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="day"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
