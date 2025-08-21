
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData: { farm: string, births: number, fill: string }[] = [];

const chartConfig = {
  births: {
    label: "Nascimentos",
  },
  // Colors can be dynamically assigned or predefined
} satisfies ChartConfig

export function BirthsByFarmChart() {
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        Nenhum dado de nascimento para exibir.
      </div>
    )
  }

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

    