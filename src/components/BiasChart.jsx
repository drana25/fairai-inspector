import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const GROUP_COLORS = ['#818cf8', '#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#a78bfa', '#fb923c'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-3 shadow-xl">
      <p className="text-white font-medium">{label}</p>
      <p className="text-indigo-300 text-sm">
        Rate: {(payload[0].value * 100).toFixed(1)}%
      </p>
      <p className="text-gray-400 text-xs">
        {payload[0].payload.positive} / {payload[0].payload.total} positive
      </p>
    </div>
  );
}

export default function BiasChart({ groups, columnName }) {
  const data = groups.map((g) => ({
    name: g.name,
    rate: g.rate,
    positive: g.positive,
    total: g.total,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
          <XAxis
            dataKey="name"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#1e1e2e' }}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#1e1e2e' }}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            domain={[0, 1]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(79,70,229,0.1)' }} />
          <Bar dataKey="rate" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={GROUP_COLORS[index % GROUP_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
