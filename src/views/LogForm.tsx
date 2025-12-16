import { useState } from 'react';
import { loginAccount } from './LogIn';
import styles from './LogForm.module.css' 

type LogFormProps = {
  setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
  onSwitchToRegister: () => void;
  onLoginSuccess?: (email: string) => void; 
}

export function LogForm(props: LogFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const userEmail = await loginAccount(email, password);
        props.setIsLogged(true);
        
        if (props.onLoginSuccess) {
            props.onLoginSuccess(userEmail || email);
        }
        
        setIsLoading(false);
    };

    return (
    <div className={styles.branding}>
      <div className={styles.loginForm}>
        <div className={styles.loginHeader}>
          <h2>Добро пожаловать!</h2>
          <p>Войдите в свой аккаунт для продолжения работы</p>
        </div>

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
            <button 
              type="button" 
              onClick={props.onSwitchToRegister} 
              className={styles.linkButton}
            >
              Зарегистрироваться
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}