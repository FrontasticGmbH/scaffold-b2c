import toast from 'react-hot-toast';
import { useFormat } from 'helpers/hooks/useFormat';

const useFeedbackToasts = () => {
  const { formatMessage: formatErrorMessage } = useFormat({ name: 'error' });
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });

  const notifyDataUpdated = () =>
    toast.success(formatAccountMessage({ id: 'data.updated', defaultMessage: 'Data updated successfully.' }));

  const notifyWentWrong = () =>
    toast.error(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry, something went wrong..' }));

  return { notifyDataUpdated, notifyWentWrong };
};

export default useFeedbackToasts;
