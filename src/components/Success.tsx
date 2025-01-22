import { useEffect, useState } from "react";

export default function MessageAnimation({ title, type }: Props) {
  const [showAnimation, setShowAnimation] = useState(false);
  useEffect(() => {
    setShowAnimation(true);

    // setTimeout(() => setShowAnimation(false), 1000); // Hide after 1 second
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-5 text-2xl font-semibold">
      {/* <button onClick={triggerAnimation}>Show Success</button> */}
      {showAnimation && type === "success" && (
        <div className="success-icon">✓</div>
      )}
      {showAnimation && type === "error" && (
        <div className="error-icon text-red-600 text-6xl animate-pulse">✗</div>
      )}
      <span dir="rtl">{title}</span>
    </div>
  );
}
interface Props {
  title: string;
  type: "error" | "success";
}
