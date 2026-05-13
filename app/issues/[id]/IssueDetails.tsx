'use client';

import { Issue } from '@prisma/client';
import { Flex, Text } from '@radix-ui/themes';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { CalendarIcon } from '@radix-ui/react-icons';

const statusOptions = [
  { value: 'OPEN', label: 'Open', color: 'var(--red)', bg: 'var(--red-bg)', border: 'rgba(255,92,92,0.3)' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'var(--yellow)', bg: 'var(--yellow-bg)', border: 'rgba(255,179,64,0.3)' },
  { value: 'CLOSED', label: 'Closed', color: 'var(--green)', bg: 'var(--green-bg)', border: 'rgba(54,211,153,0.3)' },
];

const priorityConfig = {
  LOW:    { label: 'Low',    color: '#36d399', bg: 'rgba(54,211,153,0.12)',  border: 'rgba(54,211,153,0.3)',  dot: '#36d399' },
  MEDIUM: { label: 'Medium', color: '#ffb340', bg: 'rgba(255,179,64,0.12)',  border: 'rgba(255,179,64,0.3)',  dot: '#ffb340' },
  HIGH:   { label: 'High',   color: '#ff5c5c', bg: 'rgba(255,92,92,0.12)',   border: 'rgba(255,92,92,0.3)',   dot: '#ff5c5c' },
};

const IssueDetails = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  const current = statusOptions.find(s => s.value === issue.status)!;
  const priority = priorityConfig[(issue.priority as keyof typeof priorityConfig) ?? 'MEDIUM'];

  const handleStatusChange = async (status: string) => {
    try {
      await axios.patch(`/api/issues/${issue.id}`, { status });
      toast.success('Status updated!');
      router.refresh();
    } catch {
      toast.error('Could not update status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
          <span style={{
            marginTop: '8px', width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0,
            background: current.color, boxShadow: `0 0 10px ${current.color}`, display: 'inline-block',
          }} />
          <h1 style={{
            fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800,
            fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', color: 'var(--text-1)',
            lineHeight: 1.2, margin: 0,
          }}>
            {issue.title}
          </h1>
        </div>

        <Flex align="center" gap="3" wrap="wrap">
          {/* Status pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {statusOptions.map((opt) => {
              const isActive = opt.value === issue.status;
              return (
                <button key={opt.value} onClick={() => !isActive && handleStatusChange(opt.value)}
                  style={{
                    padding: '5px 12px', borderRadius: '99px', border: `1px solid ${isActive ? opt.border : 'var(--border)'}`,
                    background: isActive ? opt.bg : 'transparent',
                    color: isActive ? opt.color : 'var(--text-3)',
                    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                    cursor: isActive ? 'default' : 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Priority badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 12px', borderRadius: '99px',
            background: priority.bg, border: `1px solid ${priority.border}`,
            color: priority.color, fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.05em', textTransform: 'uppercase',
            fontFamily: "'Cabinet Grotesk', sans-serif",
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: priority.dot, display: 'inline-block', flexShrink: 0,
            }} />
            {priority.label} Priority
          </div>

          {/* Created date */}
          <Flex align="center" gap="1" style={{ color: 'var(--text-3)', fontSize: '0.8rem' }}>
            <CalendarIcon />
            <span>{issue.createdAt.toDateString()}</span>
          </Flex>

          {/* Due date */}
          {issue.dueDate && (
            <Flex align="center" gap="1" style={{
              color: new Date(issue.dueDate) < new Date() && issue.status !== 'CLOSED'
                ? '#ff5c5c'
                : 'var(--text-3)',
              fontSize: '0.8rem',
            }}>
              <CalendarIcon />
              <span>
                Due: {new Date(issue.dueDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
                {new Date(issue.dueDate) < new Date() && issue.status !== 'CLOSED' && (
                  <span style={{ marginLeft: '4px', fontWeight: 700 }}>· Overdue</span>
                )}
              </span>
            </Flex>
          )}
        </Flex>
      </div>

      {/* Description */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '24px',
      }}>
        <div className="prose max-w-full">
          <ReactMarkdown>{issue.description}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;