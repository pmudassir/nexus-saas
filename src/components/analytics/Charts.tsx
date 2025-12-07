"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#06b6d4"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-white/10 !bg-zinc-900/90 shadow-xl">
        <p className="font-display font-medium text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs mb-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-zinc-400 capitalize">{entry.name}:</span>
            <span className="text-white font-mono font-medium">
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
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="name"
          stroke="#71717a"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#71717a"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
          dx={-10}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#6366f1"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorRevenue)"
          activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stroke="#ec4899"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorExpenses)"
          activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
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
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
          cornerRadius={6}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          formatter={(value) => <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium ml-1">{value}</span>}
        />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          <tspan x="50%" dy="-10" className="fill-foreground text-2xl font-bold font-display">85%</tspan>
          <tspan x="50%" dy="20" className="fill-muted-foreground text-xs uppercase tracking-wider">Completion</tspan>
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
