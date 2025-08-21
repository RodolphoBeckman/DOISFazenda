"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartData = [
  { sex: "Macho", count: 254, fill: "var(--color-male)" },
  { sex: "Fêmea", count: 231, fill: "var(--color-female)" },
]

const chartConfig = {
  count: {
    label: "Contagem",
  },
  male: {
    label: "Macho",
    color: "hsl(var(--chart-2))",
  },
  female: {
    label: "Fêmea",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function BirthsBySexChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" accessibilityLayer>
           <YAxis
            dataKey="sex"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
            width={80}
          />
          <XAxis type="number" hide />
          <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey="count" radius={5} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
