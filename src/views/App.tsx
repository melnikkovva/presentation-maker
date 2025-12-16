import { useState, useEffect } from 'react';
import { Editor } from './Editor/Editor';
import { LogForm } from './LogForm';
import { RegisterForm } from './RegisterForm';
import { loginOut, getUserEmail } from './LogIn';
import { setUserEmail } from '../store/slices/emailSlice';
import { useAppDispatch } from '../store/hooks';

type AuthMode = 'login' | 'register';

export function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(true);
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userEmail = await getUserEmail();
        if (userEmail) {
          setIsLogged(true);
          dispatch(setUserEmail(userEmail)); 
        } else {
          setIsLogged(false);
        }
      } catch (error) {
        setIsLogged(false);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [dispatch]);

  const handleLogout = async () => {
    await loginOut(() => setIsLogged(false));
    dispatch(setUserEmail('')); 
  };

  if (loading) return <div>Проверка сессии</div>;
  
  if (!isLogged) {
    return authMode === 'login' ? (
      <LogForm 
        setIsLogged={setIsLogged} 
        onSwitchToRegister={() => setAuthMode('register')} 
        onLoginSuccess={(email: string) => dispatch(setUserEmail(email))} 
      />
    ) : (
      <RegisterForm 
        setIsLogged={setIsLogged} 
        onSwitchToLogin={() => setAuthMode('login')} 
        onRegisterSuccess={(email: string) => dispatch(setUserEmail(email))}
      />
    );
  }

  return <Editor onLogout={handleLogout} />;
}