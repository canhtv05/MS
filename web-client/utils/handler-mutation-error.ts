import { Status } from '@/enums/common';
import axios from 'axios';
import { toast } from 'sonner';
import i18next from 'i18next';
import { ErrorMessage } from '@/enums/error-message';

export const handleMutationError = (error: unknown, id: string) => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message || error.response?.statusText || i18next.t(Status.ERROR);
    toast.error(message, { id });
    if (error.response?.data?.message === ErrorMessage.UNAUTHENTICATED) {
      toast.error(i18next.t(Status.UNAUTHENTICATED), { id });
    }
  } else {
    toast.error(i18next.t(Status.ERROR), { id });
  }
};
