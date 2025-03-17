import toast from 'react-hot-toast';
import { useTranslations } from 'use-intl';

const useFeedbackToasts = () => {
  const translate = useTranslations();

  const notifyDataUpdated = () => toast.success(translate('account.data-updated'));

  const notifyWentWrong = () => toast.error(translate('error.wentWrong'));

  return { notifyDataUpdated, notifyWentWrong };
};

export default useFeedbackToasts;
