import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { getStoredToken } from './api/client';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // トークンが存在する場合のみ認証チェックを行う
    const token = getStoredToken();
    if (token) {
      checkAuth();
    } else {
      // トークンがない場合は非認証状態として設定
      useAuthStore.setState({ isLoading: false, isAuthenticated: false });
    }
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
