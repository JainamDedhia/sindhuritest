"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragHandle from "./DragHandle";

export default function SortableBannerCard({ banner, onDelete }: any) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 rounded-xl border bg-white p-4
        transition-shadow duration-150
        ${isDragging ? "opacity-50 shadow-2xl" : "hover:shadow-md"}
      `}
    >
      {/* DRAG HANDLE */}
      <DragHandle {...attributes} {...listeners} />

      {/* IMAGE PREVIEW */}
      <img
        src={banner.image_url}
        className="h-16 w-28 rounded-lg object-cover border"
        alt="Banner preview"
      />

      {/* INFO */}
      <div className="flex-1">
        <p className="text-sm font-medium">
          {banner.device_type === "desktop" ? "Desktop" : "Mobile"} Banner
        </p>
        <p className="text-xs text-gray-500">Position #{banner.position}</p>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={() => onDelete(banner.id)}
        className="text-sm text-red-500 hover:underline px-3 py-1
                   rounded hover:bg-red-50 transition"
      >
        Delete
      </button>
    </div>
  );
}