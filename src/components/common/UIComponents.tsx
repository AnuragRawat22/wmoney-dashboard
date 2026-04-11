import React from "react";
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  innerClassName?: string;
}
export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverable = false,
  onClick,
  innerClassName = "",
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        soma-card relative overflow-hidden transition-all duration-500
        ${hoverable ? "hover:scale-[1.01] hover:border-white/20 cursor-pointer active:scale-[0.99]" : ""}
        ${className}
      `}
    >
      <div className={`relative z-10 ${innerClassName}`}>{children}</div>
      {}
      {hoverable && (
        <div className="absolute inset-0 bg-white/[0.01] opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      )}
    </div>
  );
};
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles =
    "relative inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed overflow-hidden";
  const variants = {
    primary:
      "bg-royal-amethyst text-white shadow-lg shadow-royal-amethyst/20 border border-white/10 hover:shadow-royal-amethyst/40 hover:brightness-110",
    secondary:
      "bg-white/5 text-white/60 border border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20",
    ghost: "bg-transparent text-white/40 hover:text-white hover:bg-white/5",
    danger:
      "bg-sunset-rose text-white shadow-lg shadow-sunset-rose/20 border border-white/10 hover:brightness-110",
    success:
      "bg-emerald-green text-white shadow-lg shadow-emerald-green/20 border border-white/10 hover:brightness-110",
  };
  const sizes = {
    sm: "px-4 py-2 text-[9px] rounded-xl",
    md: "px-6 py-4 text-[10px] rounded-2xl",
    lg: "px-8 py-5 text-[11px] rounded-[24px]",
    icon: "p-3 rounded-2xl",
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
      {}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:transition-all pointer-events-none group-hover:animate-[shimmer_2s_infinite]" />
    </button>
  );
};
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-royal-amethyst transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full bg-white/5 border border-white/10 rounded-[28px] text-white text-base font-bold
            placeholder:text-white/10 focus:outline-none focus:ring-2 focus:ring-royal-amethyst/40 
            transition-all ${icon ? "pl-14" : "px-6"} py-5 ${error ? "border-sunset-rose/50 focus:ring-sunset-rose/20" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[9px] font-black text-sunset-rose uppercase tracking-widest ml-2">
          {error}
        </p>
      )}
    </div>
  );
};
