import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoginPage } from './userPages/LoginPage';
import { RegisterPage } from './userPages/RegisterPage';
import { HomePage } from './userPages/HomePage'; 
import { Editor } from './Editor/Editor';
import { Player } from './Player/Player';
import { Gallery } from './Gallery/Gallery';
import { getUserEmail } from './LogIn';
import { ROUTES } from '../store/data/const_for_presantation';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const email = await getUserEmail();
      setIsAuthenticated(Boolean(email));
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {isAuthenticated ? (
          <>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.EDITOR} element={<Editor onLogout={() => setIsAuthenticated(false)} />} />
            <Route path={ROUTES.PLAYER} element={<Player />} />
            <Route path={ROUTES.GALLERY} element={<Gallery />} />

            <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.HOME} replace={false} />} />
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace={false} />} />
          </>
        ) : (
          <>
            <Route path={ROUTES.LOGIN} element={<LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage onRegisterSuccess={() => setIsAuthenticated(true)} />} />

            <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LOGIN} replace={false} />} />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace={false} />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}