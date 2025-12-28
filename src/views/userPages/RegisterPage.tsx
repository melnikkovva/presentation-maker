import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createAccount } from '../LogIn';
import { setUserEmail } from '../../store/slices/emailSlice';
import { useAppDispatch } from '../../store/hooks';
import { ROUTES } from '../../store/data/const_for_presantation';
import styles from './RegisterPage.module.css';

type RegisterPageProps = {
  onRegisterSuccess: () => void;
}

export function RegisterPage(props: RegisterPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createAccount(email, password, name);
      dispatch(setUserEmail(email));
      props.onRegisterSuccess(); 
      navigate('/editor'); 
    } catch (error) {
      setError('Ошибка при создании аккаунта');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.branding}>
      <div className={styles.loginForm}>
        <div className={styles.loginHeader}>
          <h2>Создайте аккаунт</h2>
          <p>Заполните форму, чтобы начать работу</p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.label}>Имя</div>
            <div className={styles.inputWithIcon}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.label}>Почта</div>
            <div className={styles.inputWithIcon}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.label}>Пароль</div>
            <div className={styles.inputWithIcon}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Придумайте пароль"
                required
                minLength={8}
                className={styles.input}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.loginButton} 
            disabled={isLoading}
          >
            {isLoading ? 'Создание аккаунта' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className={styles.signupLink}>
          <p>
            Уже есть аккаунт?{' '}
            <Link to={ROUTES.LOGIN} className={styles.linkButton}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}