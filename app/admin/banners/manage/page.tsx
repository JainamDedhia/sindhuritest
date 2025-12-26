"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import SortableBannerCard from "../components/SortableBannerCard";
import BannerSkeleton from "../components/BannerSkeleton";

export default function ManageBannersPage() {
  const [desktop, setDesktop] = useState<any[]>([]);
  const [mobile, setMobile] = useState<any[]>([]);
  const [activeBanner, setActiveBanner] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    fetch("/api/banners")
      .then(res => res.json())
      .then(data => {
        setDesktop(data.filter((b: any) => b.device_type === "desktop"));
        setMobile(data.filter((b: any) => b.device_type === "mobile"));
        setLoading(false);
      });
  }, []);

  const saveOrder = async (items: any[]) => {
    await fetch("/api/banners", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items),
    });
  };

  const onDragEnd = (items: any[], setItems: any, e: any) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    setItems(reordered);
    saveOrder(reordered);
  };

  const remove = async (id: string, type: "desktop" | "mobile") => {
    await fetch("/api/banners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    type === "desktop"
      ? setDesktop(d => d.filter(b => b.id !== id))
      : setMobile(m => m.filter(b => b.id !== id));
  };

  if (loading) return <BannerSkeleton />;

  const Section = ({ title, items, setItems, type }: any) => (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">{title}</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={(e) =>
          setActiveBanner(items.find((i: any) => i.id === e.active.id))
        }
        onDragEnd={(e) => {
          onDragEnd(items, setItems, e);
          setActiveBanner(null);
        }}
        onDragCancel={() => setActiveBanner(null)}
      >
        <SortableContext
          items={items.map((b: any) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((b: any) => (
              <SortableBannerCard
                key={b.id}
                banner={b}
                onDelete={() => remove(b.id, type)}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeBanner ? (
            <div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-xl">
              <img
                src={activeBanner.image_url}
                className="h-16 w-28 rounded-lg object-cover"
              />
              <span className="text-sm font-medium">
                Moving banner
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );

  return (
    <section className="max-w-5xl space-y-12">
      <h1 className="text-2xl font-semibold">Manage Banners</h1>
      <Section title="Desktop Banners" items={desktop} setItems={setDesktop} type="desktop" />
      <Section title="Mobile Banners" items={mobile} setItems={setMobile} type="mobile" />
    </section>
  );
}
