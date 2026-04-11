import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
interface LoginPageProps {
  onLogin: () => void;
}
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-midnight-navy flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-royal-amethyst/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-green/5 rounded-full blur-[100px]"></div>
      <div className="relative z-10 w-full max-w-sm text-center">
        {}
        <div className="flex flex-col items-center gap-4 mb-12">
          <div className="w-20 h-20 bg-royal-amethyst rounded-[32px] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-royal-amethyst/40 rotate-6 animate-float">
            w
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
              wMoney
            </h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">
              Student Finance Elite
            </p>
          </div>
        </div>
        {}
        <div className="soma-card p-10 spending-card-glow border-white/10">
          <h2 className="text-xl font-black text-white mb-2">Welcome Back</h2>
          <p className="text-white/40 text-sm font-medium mb-10">
            Manage your student runway with precision.
          </p>
          <button
            onClick={onLogin}
            className="w-full bg-white text-midnight-navy h-16 rounded-[24px] flex items-center justify-center gap-4 font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
          <div className="mt-8 flex items-center justify-center gap-2 text-royal-amethyst opacity-60">
            <Sparkles size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Powered by Smart Analytics
            </span>
          </div>
        </div>
        {}
        <p className="mt-12 text-white/20 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          Secure & Encrypted <ArrowRight size={10} />
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
