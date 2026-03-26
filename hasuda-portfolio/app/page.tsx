import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { defaultOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
  alternates: { canonical: "https://hasuda.org" },
  openGraph: { ...defaultOpenGraph, url: "https://hasuda.org" },
};

export default function Home() {
  return (
    <main>
      <div className={styles.keyvisual}>
        <div className={styles.keyvisualBG}>
          <Image src="/images/artworks/No-155/155-1s.webp" alt="keyvisual Illustration" fill priority quality={100}/>
        </div> {/*  
        <div className={styles.keyvisualCharacter}>
          <Image src="/images/index/keyvisual_character2.webp" alt="keyvisual Illustration" fill />
        </div>
        <div className={styles.keyvisualEffect1}>
          <Image src="/images/index/keyvisual_effect1.webp" alt="keyvisual Illustration" fill />
        </div>
        <div className={styles.keyvisualFrontObj}>
          <Image src="/images/index/keyvisual_front-obj.webp" alt="keyvisual Illustration" fill />
        </div>
        <div className={styles.keyvisualEffect2}>
          <Image src="/images/index/keyvisual_effect2.webp" alt="keyvisual Illustration" fill />
        </div>*/}
      </div>{/* 
      <h1 className={styles.pageTitle}>
        HASUDA&apos;s<br />PORTFOLIO
      </h1>*/}
      <div className={`${styles.profileCard} glass-container-type2`}>
        <div className={styles.profileContents}>
          <div className={styles.profileRow1}>
            <div className={styles.profileAvater}>
              <Image src="/images/index/151-2icon.jpg" alt="profile avatar" fill />
            </div>
            <div>
              <h1 className={styles.profileDisplayName}>蓮田</h1>
              <p className={styles.profileHandle}>@hasuda.org</p>
            </div>
          </div>
          <div className={styles.profileDetail}>
            <p>University student <span className="W3">/</span> Illustration, 3DCG</p>
            <div className={styles.profileLinks}>
              <Link href="/artworks">
                <div className="button-type1 glass-container-type2">
                  <span>作品一覧</span>
                </div>
              </Link>
              <Link href="/about">
                <div className="button-type1 glass-container-type2">
                  <span>プロフィール</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
