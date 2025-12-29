"use client";

export default function DragHandle(props: any) {
  return (
    <button
      {...props}
      type="button"
      className="cursor-grab active:cursor-grabbing
                 p-2 text-gray-400 hover:text-gray-600
                 bg-transparent border-none"
      aria-label="Drag to reorder"
    >
      {/* 9-dot drag icon */}
      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
        {[...Array(9)].map((_, i) => (
          <circle
            key={i}
            cx={(i % 3) * 6 + 2}
            cy={Math.floor(i / 3) * 6 + 2}
            r="1.2"
          />
        ))}
      </svg>
    </button>
  );
}