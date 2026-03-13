"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FinanceChartPoint } from "@/types";

export function FinanceAreaChart({ data }: { data: FinanceChartPoint[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="border-border/70 h-72 min-w-0 rounded-[28px] border bg-white/70 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eceaf7"
            />
            <XAxis dataKey="label" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#8fd2ff" radius={[10, 10, 0, 0]} />
            <Bar dataKey="expense" fill="#ac8dff" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="border-border/70 h-72 min-w-0 rounded-[28px] border bg-white/70 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eceaf7"
            />
            <XAxis dataKey="label" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#7c5cff"
              strokeWidth={3}
              dot={{ fill: "#7c5cff" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
