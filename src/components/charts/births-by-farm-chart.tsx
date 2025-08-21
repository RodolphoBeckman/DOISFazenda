"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { farm: "Sao Francisco", births: 186, fill: "var(--color-sf)" },
  { farm: "Segredo", births: 305, fill: "var(--color-segredo)"  },
  { farm: "Dois", births: 237, fill: "var(--color-dois)"  },
  { farm: "Outra", births: 73, fill: "var(--color-outra)"  },
]

const chartConfig = {
  births: {
    label: "Nascimentos",
  },
  sf: {
    label: "São Francisco",
    color: "hsl(var(--chart-1))",
  },
  segredo: {
    label: "Segredo",
    color: "hsl(var(--chart-2))",
  },
  dois: {
    label: "Dois",
    color: "hsl(var(--chart-3))",
  },
  outra: {
    label: "Outra",
    color: "hsl(var(--chart-4))",
  }
} satisfies ChartConfig

export function BirthsByFarmChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer>
        <BarChart data={chartData} accessibilityLayer>
          <XAxis
            dataKey="farm"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            fontSize={12}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey="births" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
