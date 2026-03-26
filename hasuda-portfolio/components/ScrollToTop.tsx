"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ScrollToTop.module.css";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <div className={styles.rollup}>
      <button onClick={scrollToTop} aria-label="トップへ戻る">
        <Image
          src="/images/icons/arrow_upward_24dp_5F6368_FILL0_wght300_GRAD0_opsz24.svg"
          alt="トップへ戻る"
          width={24}
          height={24}
          className={`${styles.rollupImg} glass-container-type2`}
        />
      </button>
    </div>
  );
}
