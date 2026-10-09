import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`overflow-hidden rounded-2xl bg-surface shadow-card ${className}`}>
      {children}
    </div>
  );
}
