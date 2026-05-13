"use client";

import { Skeleton } from "@/app/components";
import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

const AssigneeSelect = ({ issue }: { issue: Issue }) => {
  const queryClient = useQueryClient();
  const { data: users, error, isLoading } = useUsers();
  const { mutate: assignIssue } = useMutation({
    mutationFn: (userId: string) =>
      axios.patch(`/api/issues/${issue.id}`, { assignedToUserId: userId === '' ? null : userId }),
    onSuccess: () => { toast.success("Assignee updated."); queryClient.invalidateQueries({ queryKey: ["issues"] }); },
    onError: () => { toast.error("Could not save changes."); },
  });

  if (isLoading) return <Skeleton />;
  if (error) return null;

  return (
    <div>
      <div className="sidebar-label">Assignee</div>
      <Select.Root defaultValue={issue.assignedToUserId || ""} onValueChange={assignIssue}>
        <Select.Trigger placeholder="Assign to..." aria-label="Assign issue" style={{ width: '100%' }} />
        <Select.Content>
          <Select.Group>
            <Select.Item value="">Unassigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user.id} value={user.id}>{user.name}</Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

const useUsers = () => useQuery<User[]>({
  queryKey: ["users"],
  queryFn: () => axios.get("/api/users").then((r) => r.data),
  staleTime: 60 * 1000,
  retry: 3,
});

export default AssigneeSelect;
