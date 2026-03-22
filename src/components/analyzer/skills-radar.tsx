"use client";

import { CategoryCoverage } from "@/lib/types";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

interface SkillsRadarProps {
  data: CategoryCoverage[];
}

export function SkillsRadar({ data }: SkillsRadarProps) {
  if (data.length < 3) return null;

  const chartData = data.map((d) => ({
    label: d.label,
    coverage: d.coverage,
    matched: d.matched,
    required: d.required,
    fullMark: 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.5 }}
      className="rounded-xl border border-border bg-card/50 p-6"
    >
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Skills Coverage
      </h3>
      <p className="mb-4 text-xs text-muted-foreground/60">
        Category-level match between your resume and job requirements
      </p>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
            <PolarGrid
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="label"
              tick={{
                fill: "rgba(255,255,255,0.5)",
                fontSize: 11,
                fontWeight: 500,
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Coverage"
              dataKey="coverage"
              stroke="hsl(142, 71%, 45%)"
              fill="hsl(142, 71%, 45%)"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "hsl(142, 71%, 45%)",
                strokeWidth: 0,
              }}
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 8%)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                fontSize: "12px",
                padding: "8px 12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
              itemStyle={{ color: "hsl(142, 71%, 45%)" }}
              labelStyle={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 4 }}
              formatter={(value: unknown, _name: unknown, entry: unknown) => {
                const e = entry as { payload?: { matched?: number; required?: number } };
                const v = Number(value);
                return [
                  `${v}% (${e.payload?.matched ?? 0}/${e.payload?.required ?? 0} skills)`,
                  "Coverage",
                ];
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend pills */}
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {data.map((d) => (
          <div
            key={d.category}
            className="flex items-center gap-1.5 rounded-md bg-white/[0.03] px-2 py-1"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor:
                  d.coverage >= 75
                    ? "hsl(142, 71%, 45%)"
                    : d.coverage >= 40
                      ? "hsl(38, 92%, 50%)"
                      : "hsl(0, 72%, 51%)",
              }}
            />
            <span className="text-[10px] font-medium text-muted-foreground">
              {d.label} {d.matched}/{d.required}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
