import { useReveal } from '../../hooks/useReveal.js';

export function Reveal({ children, delay = 0, style = {} }) {
  const ref = useReveal();
  return <div ref={ref} style={{ opacity: 0, transform: "translateY(20px)", transition: `opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s, transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}s`, ...style }}>{children}</div>;
}
