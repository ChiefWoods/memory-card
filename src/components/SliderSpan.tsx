import { ReactNode } from "react";

export function SliderSpan({ children }: { children: ReactNode }) {
  return <span className="text-xs font-semibold">{children}</span>;
}
