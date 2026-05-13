"use client";

import { issueSchema } from '@/app/validationSchemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Issue } from '@prisma/client';
import { Button, Callout, Select, TextField, Text } from '@radix-ui/themes';
import axios from 'axios';
import 'easymde/dist/easymde.min.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import SimpleMDE from 'react-simplemde-editor';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type IssueFormData = z.infer<typeof issueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: (issue?.priority as IssueFormData['priority']) || 'MEDIUM',
      dueDate: issue?.dueDate
        ? new Date(issue.dueDate).toISOString().split('T')[0]
        : '',
    },
  });

  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      if (issue) await axios.patch('/api/issues/' + issue.id, data);
      else await axios.post('/api/issues', data);
      router.push('/issues/list');
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      setError('An unexpected error occurred.');
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        {/* Title */}
        <TextField.Root>
          <TextField.Input
            defaultValue={issue?.title}
            placeholder="Title"
            {...register('title')}
          />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>

        {/* Description */}
        <Controller
          name="description"
          control={control}
          defaultValue={issue?.description}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>

        {/* Priority */}
        <div>
          <Text size="2" weight="medium" className="mb-1 block">Priority</Text>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select.Root
                value={field.value || 'MEDIUM'}
                onValueChange={(val) => field.onChange(val)}
              >
                <Select.Trigger placeholder="Select priority..." />
                <Select.Content>
                  <Select.Item value="LOW">🟢 Low</Select.Item>
                  <Select.Item value="MEDIUM">🟡 Medium</Select.Item>
                  <Select.Item value="HIGH">🔴 High</Select.Item>
                </Select.Content>
              </Select.Root>
            )}
          />
        </div>

        {/* Due Date */}
        <div>
          <Text size="2" weight="medium" className="mb-1 block">Due Date</Text>
          <TextField.Root>
            <TextField.Input
              type="date"
              {...register('dueDate')}
            />
          </TextField.Root>
          <ErrorMessage>{errors.dueDate?.message}</ErrorMessage>
        </div>

        <Button disabled={isSubmitting}>
          {issue ? 'Update Issue' : 'Submit New Issue'}{' '}
          {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default IssueForm;