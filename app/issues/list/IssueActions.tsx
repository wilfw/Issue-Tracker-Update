import Link from 'next/link';
import IssueStatusFilter from './IssueStatusFilter';

const IssueActions = () => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
    <IssueStatusFilter />
    <Link href="/issues/new" className="new-issue-btn">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      New Issue
    </Link>
  </div>
);
export default IssueActions;
