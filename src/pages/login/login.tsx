import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');
    dispatch(loginUser({ email, password }))
      .unwrap()
      .catch((err) => setError(err.message || 'Ошибка авторизации'));
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
