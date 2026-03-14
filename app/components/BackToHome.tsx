import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackToHome() {
  return (
    <Link 
      href="/"
      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C8A45D] transition-colors duration-300 group py-2"
    >
      {/* The arrow gently slides to the left on hover */}
      <ArrowLeft 
        size={16} 
        strokeWidth={1.5} 
        className="group-hover:-translate-x-1 transition-transform duration-300" 
      />
      <span className="tracking-wide uppercase text-[11px] font-semibold">
        Back to Home
      </span>
    </Link>
  );
}