import { Status } from '@/enums';
import axios from 'axios';
import { toast } from 'sonner';
import i18next from 'i18next';

export const handleMutationError = (error: unknown, id: string) => {
  if (axios.isAxiosError(error)) {
    console.log(error);
    toast.error(error.response?.data?.message ?? i18next.t(Status.ERROR), { id });
  } else {
    toast.error(i18next.t(Status.ERROR), { id });
  }
};
