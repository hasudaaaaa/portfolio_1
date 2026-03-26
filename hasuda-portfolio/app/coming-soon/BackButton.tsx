"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button type="button" className="button-type1" onClick={() => router.back()}>
      戻る
    </button>
  );
}
