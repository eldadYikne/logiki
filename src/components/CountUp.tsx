import { useEffect, useRef, useState } from "react";

export default function CountUp({ target }: { target: number }) {
  const [displayedNumber, setDisplayedNumber] = useState(0);
  const currentRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const step = () => {
      const current = currentRef.current;
      const diff = target - current;
      if (Math.abs(diff) < 1) {
        setDisplayedNumber(target);
        currentRef.current = target;
        return;
      }

      const increment = Math.ceil(diff / 5); // Speed control
      currentRef.current += increment;
      setDisplayedNumber(currentRef.current);
      animationRef.current = requestAnimationFrame(step);
    };

    step();
  }, [target]);

  return <div className="text-sm ">{displayedNumber}</div>;
}
