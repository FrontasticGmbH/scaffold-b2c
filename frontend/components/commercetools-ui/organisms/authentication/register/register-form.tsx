import React, { FC, useState } from 'react';
import Button from 'components/commercetools-ui/atoms/button';
import Input from 'components/commercetools-ui/atoms/input';
import PasswordInput from 'components/commercetools-ui/atoms/input-password';
import Link from 'components/commercetools-ui/atoms/link';
import Typography from 'components/commercetools-ui/atoms/typography';
import { useFormat } from 'helpers/hooks/useFormat';
import useValidate from 'helpers/hooks/useValidate';
import Redirect from 'helpers/redirect';
import { Reference } from 'types/reference';
import { UseAccountReturn } from 'frontastic/hooks/useAccount/types';
import Feedback from '../../account/account-atoms/feedback';

export interface RegisterFormProps {
  termsOfUseLink?: Reference;
  loggedIn: UseAccountReturn['loggedIn'];
  register: UseAccountReturn['register'];
}

const RegisterForm: FC<RegisterFormProps> = ({ termsOfUseLink, loggedIn, register }) => {
  const { formatMessage: formatErrorMessage } = useFormat({ name: 'error' });
  const { formatMessage: formatAccountMessage } = useFormat({ name: 'account' });
  const { formatMessage } = useFormat({ name: 'common' });

  const { validatePassword } = useValidate();

  //register data
  const [data, setData] = useState({ firstName: '', lastName: '', email: '', password: '' });

  //error
  const [error, setError] = useState('');

  //success
  const [success, setSuccess] = useState('');

  //processing...
  const [loading, setLoading] = useState(false);

  //handle text input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  //data validation
  const validate = () => {
    const validPassword = validatePassword(data.password);

    //UI error messages
    if (!validPassword)
      setError(
        formatErrorMessage({
          id: 'password.not.valid',
          defaultMessage: 'Password has to be at least 8 characters long and have at least one uppercase letter.',
        }),
      );

    //return a boolean representing the data validity
    return validPassword;
  };

  //form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //validate data
    if (!validate()) return;
    //processing starts
    setLoading(true);
    //try registering the user with given credentials
    try {
      const response = await register(data);
      if (!response.success) {
        setError(
          response.error?.message ||
            formatErrorMessage({
              id: 'account.create.fail',
              defaultMessage: "Sorry. We couldn't create your account..",
            }),
        );
        setSuccess('');
      } else {
        setSuccess(
          formatAccountMessage({
            id: 'verification.email.sent',
            defaultMessage: 'A verification email was sent to your mail address!',
          }),
        );
      }
    } catch (err) {
      setError(formatErrorMessage({ id: 'wentWrong', defaultMessage: 'Sorry. Something went wrong..' }));
      setSuccess('');
    }
    //processing ends
    setLoading(false);
  };

  if (loggedIn) return <Redirect target="/account" />;

  return (
    <>
      <Typography as="h3" className="mb-16 text-16 md:mb-24 md:text-20 lg:text-24">
        {formatAccountMessage({ id: 'become.member', defaultMessage: 'Become a member' })}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Feedback success={success} error={error} />

        <Input
          id="name"
          name="firstName"
          type="text"
          autoComplete="firstName"
          required
          className="mb-16 md:mb-20"
          placeholder={formatMessage({ id: 'firstName', defaultMessage: 'First Name' })}
          onChange={handleChange}
        />

        <Input
          id="name"
          name="lastName"
          type="text"
          autoComplete="lastName"
          required
          className="mb-16 md:mb-20"
          placeholder={formatMessage({ id: 'lastName', defaultMessage: 'Last Name' })}
          onChange={handleChange}
        />

        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mb-16 md:mb-20"
          placeholder={formatMessage({ id: 'emailAddress', defaultMessage: 'Email Address' })}
          onChange={handleChange}
        />

        <PasswordInput
          required
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder={formatAccountMessage({ id: 'password', defaultMessage: 'Password' })}
          className="mb-16 md:mb-20"
          onChange={handleChange}
        />

        <Button size="full" type="submit" className="mb-16 text-16 leading-tight md:mb-20" disabled={loading}>
          {formatAccountMessage({ id: 'account.register', defaultMessage: 'Register' })}
        </Button>

        <div className="flex flex-wrap items-center justify-center gap-4 px-15 md:px-30">
          <Typography className="text-12 text-secondary-black md:text-14">
            {formatAccountMessage({
              id: 'by.registering',
              defaultMessage: 'By registering an account, you agree to our',
            })}
          </Typography>
          <Link className="border-b text-12 text-secondary-black md:text-14" link={termsOfUseLink} variant="menu-item">
            {formatAccountMessage({ id: 'terms.of.use', defaultMessage: 'Terms of Use.' })}
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
