import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (role: 'ADMIN' | 'CASHIER') => {
    localStorage.setItem('pos_user', JSON.stringify({ role }));
    navigate('/sales');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-slate-700/50 backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 mb-6 shadow-inner ring-1 ring-white/10">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Kiro POS</h1>
          <p className="text-slate-400 mt-2 text-sm">Select your role to continue</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleLogin('ADMIN')}
            className="w-full relative group overflow-hidden rounded-xl bg-blue-600 px-4 py-3.5 text-white font-medium transition-all hover:bg-blue-500 active:scale-[0.98] shadow-lg shadow-blue-900/50"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-2">
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Login as Admin
            </span>
          </button>
          
          <button
            onClick={() => handleLogin('CASHIER')}
            className="w-full relative group overflow-hidden rounded-xl bg-slate-700/50 px-4 py-3.5 text-slate-300 font-medium transition-all hover:bg-slate-700 hover:text-white active:scale-[0.98] border border-slate-600/50"
          >
            <span className="relative flex items-center justify-center gap-2">
              <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Login as Cashier
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
