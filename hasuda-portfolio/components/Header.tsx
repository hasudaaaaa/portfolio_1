"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={`${styles.header} glass-container-type2`}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link href="/">HASUDA.ORG</Link>
          </div>
          <nav>
            <ul className={styles.navMenu}>
              <li>
                <button
                  className={styles.humburgerMenu}
                  onClick={() => setMenuOpen(true)}
                  aria-label="メニューを開く"
                >
                  <Image
                    src="/images/icons/menu_24dp_5F6368_FILL0_wght300_GRAD0_opsz24.svg"
                    alt="hamburger-menu"
                    width={24}
                    height={24}
                    className={styles.menuIcon}
                  />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* メニューオーバーレイ */}
      <div
        className={`${styles.menuOverlay} glass-container-type1 ${menuOpen ? styles.active : ""}`}
      >
        <Link href="/about" onClick={() => setMenuOpen(false)}>
          <div>プロフィール</div>
          <small className="W3">Profile</small>
        </Link>
        <Link href="/artworks" onClick={() => setMenuOpen(false)}>
          <div>作品一覧</div>
          <small className="W3">Artworks</small>
        </Link>
        <Link href="/blogs" onClick={() => setMenuOpen(false)}>
          <div>ブログ</div>
          <small className="W3">Blog</small>
        </Link>
      </div>

      {/* 背景オーバーレイ */}
      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayActive : ""}`}
        onClick={() => setMenuOpen(false)}
      />
    </>
  );
}
