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
      axios.patch(`/api/issues/${issue.id}`, {
        assignedToUserId: userId || null,
      }),
    onSuccess: () => {
      toast.success("Issue updated.");
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
    onError: () => {
      toast.error("Changes could not be saved.");
    },
  });

  if (isLoading) return <Skeleton />;

  if (error) {
    toast.error("Failed to load users.");
    return null;
  }

  return (
    <Select.Root
      defaultValue={issue.assignedToUserId || ""}
      onValueChange={assignIssue}
    >
      <Select.Trigger placeholder="Assign..." aria-label="Assign issue" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Suggestions</Select.Label>
          <Select.Item value="">Unassigned</Select.Item>
          {users?.map((user) => (
            <Select.Item key={user.id} value={user.id}>
              {user.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000, // 1 minute
    retry: 3,
  });

export default AssigneeSelect;
