"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FinanceChartPoint } from "@/types";

function ChartFrame({
  children,
}: {
  children: (size: { width: number; height: number }) => ReactNode;
}) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!node) {
      return;
    }

    if (typeof ResizeObserver === "undefined") {
      const frameId = window.requestAnimationFrame(() => {
        const nextWidth = Math.floor(node.clientWidth);
        const nextHeight = Math.floor(node.clientHeight);

        if (nextWidth > 0 && nextHeight > 0) {
          setSize({ width: nextWidth, height: nextHeight });
        }
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      const nextWidth = Math.floor(entry.contentRect.width);
      const nextHeight = Math.floor(entry.contentRect.height);

      if (nextWidth > 0 && nextHeight > 0) {
        setSize({ width: nextWidth, height: nextHeight });
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [node]);

  return (
    <div
      ref={setNode}
      className="border-border/70 h-72 min-w-0 rounded-[28px] border bg-white/70 p-4"
    >
      {size.width > 0 && size.height > 0 ? children(size) : null}
    </div>
  );
}

export function FinanceAreaChart({ data }: { data: FinanceChartPoint[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartFrame>
        {({ width, height }) => (
          <BarChart width={width} height={height} data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eceaf7"
            />
            <XAxis dataKey="label" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="income"
              name="Receitas"
              fill="#8fd2ff"
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="expense"
              name="Despesas"
              fill="#ac8dff"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        )}
      </ChartFrame>
      <ChartFrame>
        {({ width, height }) => (
          <LineChart width={width} height={height} data={data}>
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
              name="Saldo"
              stroke="#7c5cff"
              strokeWidth={3}
              dot={{ fill: "#7c5cff" }}
            />
          </LineChart>
        )}
      </ChartFrame>
    </div>
  );
}
