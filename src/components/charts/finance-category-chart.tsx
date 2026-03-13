"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCurrency } from "@/lib/utils/formatters";
import type { CategoryBreakdown } from "@/types";

const colors = [
  "#7c5cff",
  "#ac8dff",
  "#d7ccff",
  "#8fd2ff",
  "#ffc782",
  "#b9efc5",
];

export function FinanceCategoryChart({ data }: { data: CategoryBreakdown[] }) {
  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="amount"
            innerRadius={70}
            outerRadius={95}
            strokeWidth={4}
            stroke="#ffffff"
          >
            {data.map((entry, index) => (
              <Cell key={entry.id} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              formatCurrency(
                typeof value === "number" ? value : Number(value ?? 0),
              ),
              "Valor",
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
