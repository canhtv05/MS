import { Status } from '@/enums/common';
import axios from 'axios';
import { toast } from 'sonner';
import i18next from 'i18next';
import { ErrorMessage } from '@/enums/error-message';
import { GraphQLError } from 'graphql/error';

export const handleMutationError = (error: unknown, id: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
      const graphqlErrors = error.response.data.errors;
      const firstError = graphqlErrors[0];
      const message = firstError?.message || i18next.t(Status.ERROR);
      toast.error(message, { id });
      return;
    }

    const message =
      error.response?.data?.message || error.response?.statusText || i18next.t(Status.ERROR);
    toast.error(message, { id });
    if (error.response?.data?.message === ErrorMessage.UNAUTHENTICATED) {
      toast.error(i18next.t(Status.UNAUTHENTICATED), { id });
    }
  } else if (error instanceof GraphQLError) {
    const message = error.message || i18next.t(Status.ERROR);
    toast.error(message, { id });
  } else if (Array.isArray(error)) {
    const firstError = (error as Array<{ message?: string }>)[0];
    const message = firstError?.message || i18next.t(Status.ERROR);
    toast.error(message, { id });
  } else if (error && typeof error === 'object' && 'errors' in error) {
    const errors = (error as { errors?: Array<{ message?: string }> }).errors;
    if (Array.isArray(errors) && errors.length > 0) {
      const message = errors[0]?.message || i18next.t(Status.ERROR);
      toast.error(message, { id });
    } else {
      toast.error(i18next.t(Status.ERROR), { id });
    }
  } else {
    toast.error(i18next.t(Status.ERROR), { id });
  }
};
