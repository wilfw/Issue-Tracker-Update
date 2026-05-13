import prisma from '@/prisma/client';
import { Avatar, Card, Flex, Text } from '@radix-ui/themes';
import { IssueStatusBadge } from './components';
import Link from 'next/link';

const dotColor: Record<string, string> = {
  OPEN: 'var(--red)',
  IN_PROGRESS: 'var(--yellow)',
  CLOSED: 'var(--green)',
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
        {issues.map((issue) => (
          <Link key={issue.id} href={`/issues/${issue.id}`} className="latest-issue-row">
            <Flex align="center" justify="between">
              <Flex align="center" gap="3">
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: dotColor[issue.status], flexShrink: 0, display: 'inline-block',
                  boxShadow: `0 0 6px ${dotColor[issue.status]}`,
                }} />
                <div>
                  <Text as="p" style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-1)' }}>
                    {issue.title}
                  </Text>
                  <div style={{ marginTop: '3px' }}>
                    <IssueStatusBadge status={issue.status} />
                  </div>
                </div>
              </Flex>
              {issue.assignedToUser && (
                <Avatar src={issue.assignedToUser.image!}
                  fallback={issue.assignedToUser.name?.[0] ?? '?'}
                  size="1" radius="full" title={issue.assignedToUser.name ?? ''}
                  style={{ border: '1px solid var(--border-strong)' }}
                />
              )}
            </Flex>
          </Link>
        ))}
      </div>
    </Card>
  );
};
export default LatestIssues;
