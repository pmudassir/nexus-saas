"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", revenue: 4000, expenses: 2400 },
  { name: "Feb", revenue: 3000, expenses: 1398 },
  { name: "Mar", revenue: 2000, expenses: 9800 },
  { name: "Apr", revenue: 2780, expenses: 3908 },
  { name: "May", revenue: 1890, expenses: 4800 },
  { name: "Jun", revenue: 2390, expenses: 3800 },
  { name: "Jul", revenue: 3490, expenses: 4300 },
];

const pieData = [
  { name: "Active", value: 400 },
  { name: "Completed", value: 300 },
  { name: "On Hold", value: 100 },
  { name: "In Review", value: 200 },
];

const COLORS = ["#10b981", "#f97316", "#3b82f6", "#f43f5e"];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: Record<string, unknown>;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm text-foreground p-3 rounded-2xl border border-black/5 shadow-soft-lg">
        <p className="font-display font-bold text-foreground mb-2 text-sm">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1 last:mb-0">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground capitalize font-medium">{entry.name}:</span>
            <span className="text-foreground font-mono font-bold ml-auto">
              ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
        <XAxis
          dataKey="name"
          stroke="#a1a1aa"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#a1a1aa"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Area
          type="basis"
          dataKey="revenue"
          stroke="#f97316"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorRevenue)"
          activeDot={{ r: 6, strokeWidth: 4, stroke: 'rgba(249, 115, 22, 0.2)', fill: '#fff' }}
        />
        <Area
          type="basis"
          dataKey="expenses"
          stroke="#f43f5e"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorExpenses)"
          activeDot={{ r: 6, strokeWidth: 4, stroke: 'rgba(244, 63, 94, 0.2)', fill: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ProjectStatusChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={110}
          paddingAngle={0}
          dataKey="value"
          stroke="none"
        >
          {pieData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              className="hover:opacity-90 transition-opacity duration-300 outline-none stroke-white stroke-[4px]"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-muted-foreground text-xs font-medium ml-1">{value}</span>}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          <tspan x="50%" dy="-10" className="fill-foreground text-4xl font-bold font-display tracking-tight">85%</tspan>
          <tspan x="50%" dy="24" className="fill-muted-foreground text-[10px] uppercase tracking-[0.2em] font-medium">Growth</tspan>
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
