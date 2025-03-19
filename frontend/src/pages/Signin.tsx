import { AuthForm } from '../components/auth/AuthForm';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { SessionContext } from '../SessionProvider';

function Signin() {
  const [currentUser] = useContext(SessionContext);

  if (currentUser != null) return <Navigate replace to={'/'} />;

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          ログイン / 新規登録
        </h2>
        <AuthForm />
      </div>
    </div>
  );
}

export default Signin;
