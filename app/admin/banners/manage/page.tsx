"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import SortableBannerCard from "../components/SortableBannerCard"; // Make sure this path is right
import { GripVertical } from "lucide-react";

type Banner = {
  id: string;
  image_url: string;
  device_type: string;
  position: number;
};

// 1. Smooth Drop Animation Config
const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.4",
      },
    },
  }),
};

export default function ManageBannersPage() {
  const [desktop, setDesktop] = useState<Banner[]>([]);
  const [mobile, setMobile] = useState<Banner[]>([]);
  const [activeBanner, setActiveBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Better Sensors (prevents accidental drags on buttons)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // Needs 5px movement to start
    })
  );

  useEffect(() => {
    // Mock fetch for demo - replace with your real fetch
    fetch("/api/banners")
      .then((res) => res.json())
      .then((data) => {
        // Sort by position to ensure visual order matches data order
        const sorted = data.sort((a: Banner, b: Banner) => a.position - b.position);
        setDesktop(sorted.filter((b: Banner) => b.device_type === "desktop"));
        setMobile(sorted.filter((b: Banner) => b.device_type === "mobile"));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const saveOrder = async (items: Banner[]) => {
    // Optimistic UI update is already handled by setDesktop/setMobile
    // Just send the new order to backend
    try {
      await fetch("/api/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
    } catch (err) {
      console.error("Failed to save order", err);
    }
  };

  const onDragEnd = (items: Banner[], setItems: any, e: any) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    setItems(reordered);
    saveOrder(reordered);
  };

  const remove = async (id: string, type: "desktop" | "mobile") => {
    if (!confirm("Delete this banner?")) return;
    try {
      await fetch("/api/banners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      type === "desktop"
        ? setDesktop((d) => d.filter((b) => b.id !== id))
        : setMobile((m) => m.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Studio...</div>;

  /* ================= REUSABLE LIST SECTION ================= */
  const SortableList = ({ items, setItems, type }: any) => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={(e) => setActiveBanner(items.find((i: Banner) => i.id === e.active.id))}
      onDragEnd={(e) => {
        onDragEnd(items, setItems, e);
        setActiveBanner(null);
      }}
      onDragCancel={() => setActiveBanner(null)}
    >
      <SortableContext items={items.map((b: Banner) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((b: Banner) => (
            <SortableBannerCard key={b.id} banner={b} onDelete={() => remove(b.id, type)} />
          ))}
        </div>
      </SortableContext>

      {/* 3. The "Flying" Card (Overlay) */}
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeBanner ? (
          <div className="flex items-center gap-4 rounded-xl border border-[var(--color-gold-primary)] bg-white p-3 shadow-2xl scale-105 rotate-1 cursor-grabbing">
            <div className="cursor-grabbing text-gray-400">
              <GripVertical size={20} />
            </div>
            <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-gray-100">
               <img src={activeBanner.image_url} className="h-full w-full object-cover" alt="" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Moving Banner...</p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-gray-900">Manage Display</h1>
          <p className="mt-1 text-sm text-gray-500">Drag items to reorder priority.</p>
        </div>
        <a href="/admin/banners/upload" className="text-sm font-medium text-[var(--color-gold-primary)] hover:underline">
           + Add New
        </a>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Desktop ({desktop.length})</h2>
        <SortableList items={desktop} setItems={setDesktop} type="desktop" />
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">Mobile ({mobile.length})</h2>
        <SortableList items={mobile} setItems={setMobile} type="mobile" />
      </div>
    </div>
  );
}