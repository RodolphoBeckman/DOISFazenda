
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  births: {
    label: "Nascimentos",
  },
} satisfies ChartConfig

interface BirthsByFarmChartProps {
  data: { farm: string; births: number; fill: string }[];
}


export function BirthsByFarmChart({ data }: BirthsByFarmChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        Nenhum dado de nascimento para exibir.
      </div>
    )
  }
  
  const dynamicChartConfig = data.reduce((acc, item) => {
    acc[item.farm] = {
      label: item.farm,
      color: item.fill
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <ChartContainer config={{...chartConfig, ...dynamicChartConfig}} className="min-h-[200px] w-full">
      <ResponsiveContainer>
        <BarChart data={data} accessibilityLayer>
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
            allowDecimals={false}
          />
          <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <Bar dataKey="births" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
