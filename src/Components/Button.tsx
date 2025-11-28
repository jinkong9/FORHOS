import { type MouseEventHandler, type ReactNode } from "react";

interface Button {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function Button({ children, onClick, className }: Button) {
  return (
    <button
      onClick={onClick}
      className={`w-20 h-10 rounded-2xl cursor-pointer hover:scale-105 ${className}`}
    >
      {children}
    </button>
  );
}
