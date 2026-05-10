"use client";

import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type DragOffset = {
  x: number;
  y: number;
};

type DragPoint = {
  x: number;
  y: number;
};

type DraggableProfileCardProps = {
  children: ReactNode;
  className: string;
  draggingClassName: string;
};

const AUTO_SCROLL_EDGE_SIZE = 96;
const AUTO_SCROLL_MAX_SPEED = 18;

export default function DraggableProfileCard({
  children,
  className,
  draggingClassName,
}: DraggableProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const startPointRef = useRef<DragPoint>({ x: 0, y: 0 });
  const pointerRef = useRef<DragPoint>({ x: 0, y: 0 });
  const startOffsetRef = useRef<DragOffset>({ x: 0, y: 0 });
  const startRectRef = useRef<DOMRect | null>(null);
  const startScrollYRef = useRef(0);
  const offsetRef = useRef<DragOffset>({ x: 0, y: 0 });
  const scrollFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const [offset, setOffset] = useState<DragOffset>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const getFooterBottom = () => {
    const footer = document.querySelector("footer");
    const footerRect = footer?.getBoundingClientRect();

    return footerRect ? footerRect.bottom + window.scrollY : document.documentElement.scrollHeight;
  };

  const clampOffset = (
    nextOffset: DragOffset,
    rect: DOMRect | null = cardRef.current?.getBoundingClientRect() ?? null,
    baseOffset = offsetRef.current,
    baseScrollY = window.scrollY,
  ) => {
    if (!rect) return nextOffset;

    const minX = baseOffset.x - rect.left;
    const maxX = baseOffset.x + window.innerWidth - rect.right;
    const minY = baseOffset.y - (rect.top + baseScrollY);
    const maxY = baseOffset.y + getFooterBottom() - (rect.bottom + baseScrollY);

    return {
      x: Math.min(Math.max(nextOffset.x, minX), maxX),
      y: Math.min(Math.max(nextOffset.y, minY), maxY),
    };
  };

  const setClampedOffset = (
    nextOffset: DragOffset,
    rect?: DOMRect | null,
    baseOffset?: DragOffset,
    baseScrollY?: number,
  ) => {
    const clampedOffset = clampOffset(nextOffset, rect, baseOffset, baseScrollY);

    offsetRef.current = clampedOffset;
    setOffset(clampedOffset);
  };

  const updateDragOffset = () => {
    const nextOffset = {
      x: startOffsetRef.current.x + pointerRef.current.x + window.scrollX - startPointRef.current.x,
      y: startOffsetRef.current.y + pointerRef.current.y + window.scrollY - startPointRef.current.y,
    };

    setClampedOffset(nextOffset, startRectRef.current, startOffsetRef.current, startScrollYRef.current);
  };

  const getAutoScrollAmount = () => {
    const pointerY = pointerRef.current.y;

    if (pointerY < AUTO_SCROLL_EDGE_SIZE) {
      return -Math.ceil(((AUTO_SCROLL_EDGE_SIZE - pointerY) / AUTO_SCROLL_EDGE_SIZE) * AUTO_SCROLL_MAX_SPEED);
    }

    if (pointerY > window.innerHeight - AUTO_SCROLL_EDGE_SIZE) {
      return Math.ceil(
        ((pointerY - (window.innerHeight - AUTO_SCROLL_EDGE_SIZE)) / AUTO_SCROLL_EDGE_SIZE) *
          AUTO_SCROLL_MAX_SPEED,
      );
    }

    return 0;
  };

  const runAutoScroll = () => {
    if (!isDraggingRef.current) return;

    const scrollAmount = getAutoScrollAmount();

    if (scrollAmount !== 0) {
      window.scrollBy({ top: scrollAmount, behavior: "instant" });
      updateDragOffset();
    }

    scrollFrameRef.current = window.requestAnimationFrame(runAutoScroll);
  };

  const startAutoScroll = () => {
    if (scrollFrameRef.current !== null) return;
    scrollFrameRef.current = window.requestAnimationFrame(runAutoScroll);
  };

  const stopAutoScroll = () => {
    if (scrollFrameRef.current === null) return;

    window.cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = null;
  };

  const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;

    if (card?.hasPointerCapture(event.pointerId)) {
      card.releasePointerCapture(event.pointerId);
    }

    isDraggingRef.current = false;
    setIsDragging(false);
    stopAutoScroll();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const distance = event.shiftKey ? 40 : 10;
    const nextOffset = { ...offset };

    if (event.key === "ArrowUp") nextOffset.y -= distance;
    else if (event.key === "ArrowDown") nextOffset.y += distance;
    else if (event.key === "ArrowLeft") nextOffset.x -= distance;
    else if (event.key === "ArrowRight") nextOffset.x += distance;
    else return;

    event.preventDefault();
    setClampedOffset(nextOffset);
  };

  useEffect(() => {
    const keepCardInViewport = () => {
      setOffset((currentOffset) => {
        const card = cardRef.current;
        if (!card) return currentOffset;

        const rect = card.getBoundingClientRect();
        const minX = currentOffset.x - rect.left;
        const maxX = currentOffset.x + window.innerWidth - rect.right;
        const minY = currentOffset.y - (rect.top + window.scrollY);
        const maxY = currentOffset.y + getFooterBottom() - (rect.bottom + window.scrollY);
        const clampedOffset = {
          x: Math.min(Math.max(currentOffset.x, minX), maxX),
          y: Math.min(Math.max(currentOffset.y, minY), maxY),
        };

        offsetRef.current = clampedOffset;

        return clampedOffset;
      });
    };

    window.addEventListener("resize", keepCardInViewport);

    return () => {
      window.removeEventListener("resize", keepCardInViewport);
      stopAutoScroll();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${className} ${isDragging ? draggingClassName : ""}`}
      style={
        {
          "--profile-card-x": `${offset.x}px`,
          "--profile-card-y": `${offset.y}px`,
        } as CSSProperties
      }
      role="group"
      tabIndex={0}
      aria-label="profile card"
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => {
        if (event.button !== 0) return;

        const card = cardRef.current;
        if (!card) return;

        card.setPointerCapture(event.pointerId);
        pointerRef.current = { x: event.clientX, y: event.clientY };
        startPointRef.current = { x: event.clientX + window.scrollX, y: event.clientY + window.scrollY };
        startOffsetRef.current = offsetRef.current;
        startRectRef.current = card.getBoundingClientRect();
        startScrollYRef.current = window.scrollY;
        isDraggingRef.current = true;
        setIsDragging(true);
        startAutoScroll();
      }}
      onPointerMove={(event) => {
        if (!isDragging) return;

        pointerRef.current = { x: event.clientX, y: event.clientY };
        updateDragOffset();
      }}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      {children}
    </div>
  );
}
