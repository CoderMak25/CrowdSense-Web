import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  const handleDemoLogin = async () => {
    await login('demo@crowdsense.ai', 'demo', true);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-[#0D0D0D]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-[#EBF5EF] flex items-center justify-center text-[#1A5C38] shadow-sm">
                <Shield size={24} strokeWidth={1.5} />
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-[#0D0D0D]">
          Crowd<span className="text-[#1A5C38]">Sense</span>
        </h2>
        <p className="mt-2 text-center text-sm font-light text-[#6B6B6B]">
          Precision crowd intelligence platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-[#E8E8E8] rounded-[24px] sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#0D0D0D]">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-[#E8E8E8] rounded-xl shadow-sm placeholder-[#9E9E9E] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] focus:border-[#1A5C38] sm:text-sm transition-colors text-[#0D0D0D]"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0D0D0D]">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2.5 border border-[#E8E8E8] rounded-xl shadow-sm placeholder-[#9E9E9E] focus:outline-none focus:ring-1 focus:ring-[#1A5C38] focus:border-[#1A5C38] sm:text-sm transition-colors text-[#0D0D0D]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#1A5C38] focus:ring-[#1A5C38] border-[#E8E8E8] rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-normal text-[#6B6B6B] cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#1A5C38] hover:text-[#2D8B55] transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border-none shadow-md rounded-full text-sm font-medium text-white bg-gradient-to-r from-[#1A5C38] to-[#2D8B55] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A5C38] transition-all disabled:opacity-70"
              >
                {isLoading ? 'Authenticating...' : 'Sign in to Dashboard'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-[#E8E8E8]">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full flex justify-center py-3 px-4 rounded-full border border-[#E8E8E8] shadow-sm text-sm font-medium text-[#0D0D0D] bg-white hover:bg-[#F5F5F5] transition-colors gap-2 items-center"
            >
              Continue with Demo Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
