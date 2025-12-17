import { Status } from '@/enums/common';
import axios from 'axios';
import { toast } from 'sonner';
import i18next from 'i18next';
import { ErrorMessage } from '@/enums/error-message';

export const handleMutationError = (error: unknown, id: string) => {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message ?? i18next.t(Status.ERROR), { id });
    if (error.response?.data?.message === ErrorMessage.UNAUTHENTICATED) {
      toast.error(i18next.t(Status.UNAUTHENTICATED), { id });
    }
  } else {
    toast.error(i18next.t(Status.ERROR), { id });
  }
};
