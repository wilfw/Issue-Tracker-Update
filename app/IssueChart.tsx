'use client';

import { Card } from '@radix-ui/themes';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Cell, Tooltip } from 'recharts';

interface Props { open: number; inProgress: number; closed: number; }

const barColors = [
  { fill: '#ff5c5c', glow: 'rgba(255,92,92,0.3)' },
  { fill: '#ffb340', glow: 'rgba(255,179,64,0.3)' },
  { fill: '#36d399', glow: 'rgba(54,211,153,0.3)' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const color = barColors[payload[0].payload.idx]?.fill;
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border-strong)',
      borderRadius: '10px', padding: '10px 16px',
      boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px ${color}33`,
      fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-1)',
    }}>
      <span style={{ color }}>{payload[0].payload.label}</span>
      <span style={{ color: 'var(--text-2)', marginLeft: '8px' }}>{payload[0].value}</span>
    </div>
  );
};

const IssueChart = ({ open, inProgress, closed }: Props) => {
  const data = [
    { label: 'Open', value: open, idx: 0 },
    { label: 'In Progress', value: inProgress, idx: 1 },
    { label: 'Closed', value: closed, idx: 2 },
  ];
  const total = open + inProgress + closed;
  return (
    <Card>
      <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'var(--text-1)' }}>
          Overview
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-3)', fontWeight: 600 }}>
          {total} total
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="40%" margin={{ top: 16, right: 20, left: -12, bottom: 4 }}>
          <XAxis dataKey="label" axisLine={false} tickLine={false}
            tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--text-3)', fontFamily: 'Cabinet Grotesk' }} />
          <YAxis axisLine={false} tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-3)' }} allowDecimals={false}
            domain={[0, (max: number) => Math.max(max + 1, 4)]} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }} />
          <Bar dataKey="value" radius={[6, 6, 2, 2]} minPointSize={3}>
            {data.map((_, i) => (
              <Cell key={i} fill={barColors[i].fill} fillOpacity={data[i].value === 0 ? 0.2 : 1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
export default IssueChart;
