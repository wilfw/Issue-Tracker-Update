import prisma from '@/prisma/client';
import { Box, Flex, Grid } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import DeleteIssueButton from './DeleteIssueButton';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';
import AssigneeSelect from './AssigneeSelect';
import { cache } from 'react';

interface Props { params: { id: string } }

const fetchIssue = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } })
);

const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const issue = await fetchIssue(parseInt(params.id));
  if (!issue) notFound();

  return (
    <Grid columns={{ initial: '1', sm: '5' }} gap="6" style={{ paddingTop: '8px' }}>
      <Box style={{ gridColumn: 'span 4' }}>
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'sticky', top: '80px' }}>
            <div className="sidebar-panel">
              <AssigneeSelect issue={issue} />
            </div>
            <div className="sidebar-panel" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="sidebar-label">Actions</div>
              <EditIssueButton issueId={issue.id} />
              <DeleteIssueButton issueId={issue.id} />
            </div>
          </div>
        </Box>
      )}
    </Grid>
  );
};

export async function generateMetadata({ params }: Props) {
  const issue = await fetchIssue(parseInt(params.id));
  return { title: issue?.title, description: 'Details of issue ' + issue?.id };
}

export default IssueDetailPage;
