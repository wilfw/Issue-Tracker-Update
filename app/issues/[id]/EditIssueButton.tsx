import Link from 'next/link';
import { Pencil2Icon } from '@radix-ui/react-icons';

const EditIssueButton = ({ issueId }: { issueId: number }) => (
  <Link href={`/issues/edit/${issueId}`} style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '9px 16px', borderRadius: '9px',
    background: 'var(--surface-2)', border: '1px solid var(--border-strong)',
    color: 'var(--text-1)', fontWeight: 600, fontSize: '0.875rem',
    textDecoration: 'none', transition: 'all 0.15s ease',
  }}
    className="edit-btn"
  >
    <Pencil2Icon /> Edit Issue
  </Link>
);
export default EditIssueButton;
