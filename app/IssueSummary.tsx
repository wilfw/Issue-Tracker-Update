import { Status } from '@prisma/client';
import { Flex, Text } from '@radix-ui/themes';
import Link from 'next/link';

interface Props { open: number; inProgress: number; closed: number; }

const IssueSummary = ({ open, inProgress, closed }: Props) => {
  const items = [
    { label: 'Open', value: open, status: 'OPEN' as Status, color: 'var(--red)', bg: 'var(--red-bg)', cls: 'summary-card-open', dot: 'status-dot-open' },
    { label: 'In Progress', value: inProgress, status: 'IN_PROGRESS' as Status, color: 'var(--yellow)', bg: 'var(--yellow-bg)', cls: 'summary-card-progress', dot: '' },
    { label: 'Closed', value: closed, status: 'CLOSED' as Status, color: 'var(--green)', bg: 'var(--green-bg)', cls: 'summary-card-closed', dot: '' },
  ];
  return (
    <Flex gap="3">
      {items.map((item) => (
        <Link key={item.label} href={`/issues/list?status=${item.status}`} className="summary-card-link">
          <div className={`summary-card ${item.cls}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                {item.label}
              </span>
              <span className={item.dot} style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, display: 'inline-block' }} />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: "'Cabinet Grotesk', sans-serif", color: item.color, lineHeight: 1, marginBottom: '6px' }}>
              {item.value}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>issues</div>
          </div>
        </Link>
      ))}
    </Flex>
  );
};
export default IssueSummary;
