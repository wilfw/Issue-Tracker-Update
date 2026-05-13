import prisma from '@/prisma/client';
import { Avatar, Card, Flex, Text } from '@radix-ui/themes';
import { IssueStatusBadge } from './components';
import Link from 'next/link';

const dotColor: Record<string, string> = {
  OPEN: 'var(--red)',
  IN_PROGRESS: 'var(--yellow)',
  CLOSED: 'var(--green)',
};

const priorityConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  LOW:    { label: 'Low',    color: '#36d399', bg: 'rgba(54,211,153,0.12)',  border: 'rgba(54,211,153,0.3)' },
  MEDIUM: { label: 'Medium', color: '#ffb340', bg: 'rgba(255,179,64,0.12)', border: 'rgba(255,179,64,0.3)' },
  HIGH:   { label: 'High',   color: '#ff5c5c', bg: 'rgba(255,92,92,0.12)',  border: 'rgba(255,92,92,0.3)'  },
};

const LatestIssues = async () => {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: 'desc' }, take: 5,
    include: { assignedToUser: true },
  });

  return (
    <Card style={{ padding: '20px', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <span style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, fontSize: '1rem', color: 'var(--text-1)' }}>
          Latest Issues
        </span>
        <Link href="/issues/list" style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
          View all →
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {issues.map((issue) => {
          const priority = priorityConfig[issue.priority ?? 'MEDIUM'];
          const isOverdue = issue.dueDate
            && new Date(issue.dueDate) < new Date()
            && issue.status !== 'CLOSED';

          return (
            <Link key={issue.id} href={`/issues/${issue.id}`} className="latest-issue-row">
              <Flex align="center" justify="between">
                <Flex align="center" gap="3">
                  {/* Status dot */}
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: dotColor[issue.status], flexShrink: 0, display: 'inline-block',
                    boxShadow: `0 0 6px ${dotColor[issue.status]}`,
                  }} />

                  <div>
                    {/* Title */}
                    <Text as="p" style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-1)' }}>
                      {issue.title}
                    </Text>

                    {/* Status + Priority + Due date row */}
                    <Flex align="center" gap="2" style={{ marginTop: '4px', flexWrap: 'wrap' }}>
                      <IssueStatusBadge status={issue.status} />

                      {/* Priority badge */}
                      <span style={{
                        padding: '2px 8px', borderRadius: '99px',
                        background: priority.bg, border: `1px solid ${priority.border}`,
                        color: priority.color, fontSize: '0.68rem', fontWeight: 700,
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                      }}>
                        {priority.label}
                      </span>

                      {/* Due date */}
                      {issue.dueDate && (
                        <span style={{
                          fontSize: '0.7rem', fontWeight: 500,
                          color: isOverdue ? '#ff5c5c' : 'var(--text-3)',
                        }}>
                          📅 {new Date(issue.dueDate).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                          {isOverdue && <span style={{ fontWeight: 700 }}> · Overdue</span>}
                        </span>
                      )}
                    </Flex>
                  </div>
                </Flex>

                {/* Assignee avatar */}
                {issue.assignedToUser && (
                  <Avatar
                    src={issue.assignedToUser.image!}
                    fallback={issue.assignedToUser.name?.[0] ?? '?'}
                    size="1" radius="full"
                    title={issue.assignedToUser.name ?? ''}
                    style={{ border: '1px solid var(--border-strong)', flexShrink: 0 }}
                  />
                )}
              </Flex>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};

export default LatestIssues;