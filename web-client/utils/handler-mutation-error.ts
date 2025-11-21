import { Status } from '@/enums';
import axios from 'axios';
import { toast } from 'sonner';

export const handleMutationError = (error: unknown, id: string) => {
  if (axios.isAxiosError(error)) {
    console.log(error);
    toast.error(error.response?.data?.message ?? Status.ERROR, { id });
  } else {
    toast.error(Status.ERROR, { id });
  }
};
