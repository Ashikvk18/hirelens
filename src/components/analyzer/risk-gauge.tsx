"use client";

import { RejectionRisk } from "@/lib/types";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";

interface RiskGaugeProps {
  risk: RejectionRisk;
}

const RISK_CONFIG = {
  high: {
    color: "hsl(0, 72%, 51%)",
    bgColor: "hsl(0, 72%, 51%, 0.12)",
    trackColor: "hsl(0, 72%, 51%, 0.08)",
    label: "High Risk",
    icon: ShieldAlert,
    description: "Your resume has significant gaps for this role",
  },
  medium: {
    color: "hsl(38, 92%, 50%)",
    bgColor: "hsl(38, 92%, 50%, 0.12)",
    trackColor: "hsl(38, 92%, 50%, 0.08)",
    label: "Medium Risk",
    icon: Shield,
    description: "Some improvements could strengthen your application",
  },
  low: {
    color: "hsl(142, 71%, 45%)",
    bgColor: "hsl(142, 71%, 45%, 0.12)",
    trackColor: "hsl(142, 71%, 45%, 0.08)",
    label: "Low Risk",
    icon: ShieldCheck,
    description: "Your resume is well-positioned for this role",
  },
};

export function RiskGauge({ risk }: RiskGaugeProps) {
  const config = RISK_CONFIG[risk.level];
  const Icon = config.icon;

  const data = [
    { name: "risk", value: risk.score },
    { name: "remaining", value: 100 - risk.score },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="rounded-xl border border-border p-6"
      style={{ backgroundColor: config.bgColor }}
    >
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Rejection Risk
      </h3>
      <p className="mb-4 text-xs text-muted-foreground/60">
        Likelihood of ATS or recruiter rejection
      </p>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative h-[130px] w-[130px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={58}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                <Cell fill={config.color} />
                <Cell fill={config.trackColor} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold"
              style={{ color: config.color }}
            >
              {risk.score}%
            </motion.span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <Icon size={16} style={{ color: config.color }} />
            <span className="text-sm font-bold" style={{ color: config.color }}>
              {config.label}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {config.description}
          </p>
          {risk.reasons.length > 0 && (
            <ul className="mt-2.5 space-y-1">
              {risk.reasons.slice(0, 3).map((reason, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1.5 text-[11px] text-muted-foreground/80"
                >
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  {reason}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
}
