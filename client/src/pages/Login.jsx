import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Users } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('operator@crowdsense.ai'); // Pre-fill for demo
  const [password, setPassword] = useState('password123'); // Pre-fill for demo
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-pagebg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                <Users size={24} strokeWidth={1.5} />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-textpri">
          Crowd<span className="text-primary">Sense</span> AI
        </h2>
        <p className="mt-2 text-center text-sm text-textsec">
          Precision crowd intelligence platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-bordercol rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-textpri">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-bordercol rounded-lg shadow-sm placeholder-textmuted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-textpri">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-bordercol rounded-lg shadow-sm placeholder-textmuted focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-bordercol rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-textsec cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primarylight">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primarylight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-70"
              >
                {isLoading ? 'Authenticating...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-bordercol" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-textmuted">For Demo Evaluation</span>
              </div>
            </div>
             <p className="text-xs text-center text-textsec mt-4">Demo account: operator@crowdsense.ai / password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
