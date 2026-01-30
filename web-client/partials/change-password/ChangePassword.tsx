'use client';

import { useAuthMutation } from '@/services/mutations/auth';
import { changePasswordSchema } from '@/validations/auth';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { LockPassword } from '@solar-icons/react-perf/Outline';

interface IChangePasswordProps {
  onSuccess: () => void;
}

const ChangePassword = ({ onSuccess }: IChangePasswordProps) => {
  const { t } = useTranslation('auth');
  const { changePasswordMutation } = useAuthMutation();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: z.infer<typeof changePasswordSchema>) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      id="change-password-form"
      className="space-y-2 flex flex-col gap-1 section-clickable h-full "
    >
      <Controller
        name="currentPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            id="currentPassword"
            label={t('change_password.current_password')}
            placeholder="••••••••"
            type="password"
            required
            validate
            inputSize="md"
            errorText={fieldState?.error?.message}
            icon={<LockPassword className="size-5 p-0.5 text-foreground/70" />}
          />
        )}
      />
      <Controller
        name="newPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            id="newPassword"
            label={t('change_password.new_password')}
            placeholder="••••••••"
            type="password"
            required
            validate
            inputSize="md"
            errorText={fieldState.error?.message}
            icon={<LockPassword className="size-5 p-0.5 text-foreground/70" />}
            value={field.value}
          />
        )}
      />
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Input
            {...field}
            id="confirmPassword"
            label={t('change_password.confirm_password')}
            placeholder="••••••••"
            type="password"
            required
            validate
            inputSize="md"
            icon={<LockPassword className="size-5 p-0.5 text-foreground/70" />}
            errorText={fieldState?.error?.message}
          />
        )}
      />
    </form>
  );
};

export default ChangePassword;
