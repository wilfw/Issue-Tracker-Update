import { IssueStatusBadge } from '@/app/components'
import { ArrowUpIcon } from '@radix-ui/react-icons'
import { Table, Text } from '@radix-ui/themes'
import Link from 'next/link'
import NextLink from 'next/link';
import { Issue, Status } from '@prisma/client'

export interface IssueQuery {
  status: Status;
  orderBy: keyof Issue;
  page: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: Issue[];
}

const dotColor: Record<string, string> = {
  OPEN: 'var(--red)',
  IN_PROGRESS: 'var(--yellow)',
  CLOSED: 'var(--green)',
};

const IssueTable = ({ searchParams, issues }: Props) => (
  <Table.Root variant="surface">
    <Table.Header>
      <Table.Row>
        {columns.map((col) => (
          <Table.ColumnHeaderCell key={col.value} className={col.className}>
            <NextLink href={{ query: { ...searchParams, orderBy: col.value } }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'inherit' }}>
              {col.label}
              {col.value === searchParams.orderBy && <ArrowUpIcon style={{ color: 'var(--accent)' }} />}
            </NextLink>
          </Table.ColumnHeaderCell>
        ))}
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {issues.map((issue) => (
        <Table.Row key={issue.id}>
          <Table.Cell>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                background: dotColor[issue.status],
                boxShadow: `0 0 6px ${dotColor[issue.status]}`,
                display: 'inline-block',
              }} />
              <div>
                <Link href={`/issues/${issue.id}`} style={{
                  fontWeight: 500, color: 'var(--text-1)', textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
                  className="issue-title-link">
                  {issue.title}
                </Link>
                <div className="block md:hidden" style={{ marginTop: '4px' }}>
                  <IssueStatusBadge status={issue.status} />
                </div>
              </div>
            </div>
          </Table.Cell>
          <Table.Cell className="hidden md:table-cell">
            <IssueStatusBadge status={issue.status} />
          </Table.Cell>
          <Table.Cell className="hidden md:table-cell">
            <Text size="2" style={{ color: 'var(--text-3)' }}>{issue.createdAt.toDateString()}</Text>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Root>
);

const columns: { label: string; value: keyof Issue; className?: string }[] = [
  { label: 'Issue', value: 'title' },
  { label: 'Status', value: 'status', className: 'hidden md:table-cell' },
  { label: 'Created', value: 'createdAt', className: 'hidden md:table-cell' },
];

export const columnNames = columns.map((c) => c.value);
export default IssueTable;
