import { useState } from 'react';
import { createAccount } from './LogIn'; 
import styles from './RegisterForm.module.css'

type RegisterFormProps = {
  setIsLogged: (logged: boolean) => void;
  onSwitchToLogin: () => void;
  onRegisterSuccess?: (email: string) => void; 
}

export function RegisterForm(props: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await createAccount(email, password, name);
    props.setIsLogged(true);
    
    if (props.onRegisterSuccess) {
      props.onRegisterSuccess(email);
    }
    
    setIsLoading(false);
  };

   return (
    <div className={styles.branding}>
      <div className={styles.loginForm}>
        <div className={styles.loginHeader}>
          <h2>Создайте аккаунт</h2>
          <p>Заполните форму, чтобы начать работу</p>
        </div>

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
            <button 
              type="button" 
              onClick={props.onSwitchToLogin} 
              className={styles.linkButton}
            >
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}