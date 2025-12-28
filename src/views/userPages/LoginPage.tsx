import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAccount } from '../LogIn';
import { setUserEmail } from '../../store/slices/emailSlice';
import { useAppDispatch } from '../../store/hooks';
import { ROUTES } from '../../store/data/const_for_presantation';
import styles from './LoginPage.module.css';

type LoginPageProps = {
  onLoginSuccess: () => void;
}

export function LoginPage(props: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const userEmail = await loginAccount(email, password);
      dispatch(setUserEmail(userEmail || email));
      props.onLoginSuccess(); 
      navigate(ROUTES.EDITOR); 
    } catch (error) {
      setError('Неверный email или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.branding}>
      <div className={styles.loginForm}>
        <div className={styles.loginHeader}>
          <h2>Добро пожаловать!</h2>
          <p>Войдите в свой аккаунт для продолжения работы</p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.label}>Почта</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ваш email"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.label}>Пароль</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ваш пароль"
              required
              className={styles.input}
            />
          </div>

          <button 
            type="submit" 
            className={styles.loginButton} 
            disabled={isLoading}
          >
            {isLoading ? 'Выполняется вход' : 'Войти в аккаунт'}
          </button>
        </form>

        <div className={styles.signupLink}>
          <p>
            Нет аккаунта?{' '}
            <Link to={ROUTES.REGISTER} className={styles.linkButton}>
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}