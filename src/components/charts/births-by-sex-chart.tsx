
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent
} from "@/components/ui/chart"


const chartConfig = {
  count: {
    label: "Contagem",
  },
  Macho: {
    label: "Macho",
    color: "hsl(var(--chart-2))",
  },
  Fêmea: {
    label: "Fêmea",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface BirthsBySexChartProps {
  data: { sex: string; count: number; fill: string }[];
}

export function BirthsBySexChart({ data }: BirthsBySexChartProps) {
    if (!data || data.every(d => d.count === 0)) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        Nenhum dado para exibir.
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" accessibilityLayer>
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
           <Legend content={<ChartLegendContent />} />
          <Bar dataKey="count" radius={5} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
