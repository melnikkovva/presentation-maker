import { useState } from 'react';
import { loginAccount } from './LogIn'; 

interface LogFormProps {
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>;
    onSwitchToRegister: () => void;
}

export function LogForm({ setIsLogged, onSwitchToRegister }: LogFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await loginAccount(email, password, setIsLogged);
        } catch (err: any) {
            console.error('Login error:', err);
            setError('Неверный email или пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="branding">
        <div className="login-form">
            <div className="login-header">
            <h2>Добро пожаловать!</h2>
            <p>Войдите в свой аккаунт для продолжения работы</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                    placeholder="Введите ваш пароль"
                    required
                />
                </div>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Вход...' : 'Войти в аккаунт'}
            </button>
            </form>

            <div className="signup-link">
            <p>
                Нет аккаунта?{' '}
                <button type="button" onClick={onSwitchToRegister} className="link-button">
                Зарегистрироваться
                </button>
            </p>
            </div>
        </div>
        </div>
    );
}