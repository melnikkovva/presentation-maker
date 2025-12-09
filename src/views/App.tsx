import { useState, useEffect } from 'react';
import { PresentationTitle } from './PresentationTitle/PresentationTitle';
import { Workspace } from './Workspace/Workspace';
import { SlideList } from './SlideList/SlideList';
import { Toolbar } from './Toolbar/Toolbar';
import styles from './App.module.css';
import { useHotKeys } from '../hooks/useHotKeys';
import { LogForm } from './LogForm';
import { RegisterForm } from './RegisterForm';
import { getCurrentSession, loginOut} from './LogIn'; 
import { Button } from '../common/Button/Button';

type AuthMode = 'login' | 'register';

export function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const sessions = await getCurrentSession();
      if (sessions && sessions.length > 0) {
        setIsLogged(true);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

   const handleLogout = async () => {
    await loginOut(setIsLogged);
  };

  if (loading) {
    return <div className="loading">Проверка сессии...</div>;
  }

  if (!isLogged) {
    return (
      <>
        {authMode === 'login' ? (
          <LogForm
            setIsLogged={setIsLogged}
            onSwitchToRegister={() => setAuthMode('register')}
          />
        ) : (
          <RegisterForm
            setIsLogged={setIsLogged}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </>
    );
  }

  function Editor() {
  useHotKeys();

  return (
    <div className={styles.app}>
      <PresentationTitle />
        <Toolbar onLogout={handleLogout} />
      <div className={styles.mainContainer}>
        <SlideList />
        <Workspace />
      </div>
    </div>
  );
}

  return <Editor />;
}