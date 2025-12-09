import { useState } from 'react';
import { createAccount } from './LogIn'; 

interface RegisterFormProps {
  setIsLogged: (logged: boolean) => void;
  onSwitchToLogin: () => void;
}

export function RegisterForm({ setIsLogged, onSwitchToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await createAccount(email, password, name);
      setIsLogged(true);
      onSwitchToLogin(); 
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="branding">
      <div className="login-form">
        <div className="login-header">
          <h2>Создайте аккаунт</h2>
          <p>Заполните форму, чтобы начать работу</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div>Имя</div>
            <div className="input-with-icon">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div>Почта</div>
            <div className="input-with-icon">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите ваш email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div>Пароль</div>
            <div className="input-with-icon">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Придумайте пароль"
                required
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Создание...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="signup-link">
          <p>
            Уже есть аккаунт?{' '}
            <button type="button" onClick={onSwitchToLogin} className="link-button">
              Войти
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}