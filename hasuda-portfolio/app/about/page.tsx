import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { defaultOpenGraph } from "@/lib/metadata";
import { HasudaIcon } from "@/components/icons/hasuda-icon";

export const metadata: Metadata = {
  title: "プロフィール - hasuda.org",
  alternates: { canonical: "https://hasuda.org/about" },
  openGraph: { ...defaultOpenGraph, url: "https://hasuda.org/about" },
};

export default function About() {
  return (
    <main>
      <div className="layout">
        <div className="main-section">
          <hgroup className="page-head">
            <h1>プロフィール</h1>
            <small>PROFILE</small>
          </hgroup>
          <article>
            <section className={styles.bio}>
              <div>
                <div className={styles.profileAvater}>
                  <Image src="/images/index/151-2icon.jpg" alt="プロフィール画像" fill quality={100}/>
                </div>
              </div>
              <div className={styles.resume}>
                <h2>蓮田</h2>
                <small>mail : contact@hasuda.org</small>
                <ul className={`${styles.snsLinks}`}>
                  <li>
                    <a href="https://twitter.com/hasudaaaaaaa" target="_blank" rel="noopener noreferrer">
                      <Image src="/images/icons/brand-twitter1.svg" alt="twitter" width={32} height={32} className={styles.snsIcon} />
                    </a>
                  </li>
                  <li>
                    <a href="https://www.pixiv.net/users/46313245" target="_blank" rel="noopener noreferrer">
                      <Image src="/images/icons/pixiv.svg" alt="pixiv" width={32} height={32} className={styles.snsIcon} />
                    </a>
                  </li>
                  <li>
                    <a href="https://bsky.app/profile/hasuda.org" target="_blank" rel="noopener noreferrer">
                      <Image src="/images/icons/brand-bluesky.svg" alt="Bluesky" width={32} height={32} className={styles.snsIcon} />
                    </a>
                  </li>
                </ul>
                <p className="W3">趣味絵描人間。</p>
                <p className="W3">
                  芝浦工業大学の創作サークル
                  <a href="https://digicre.net/welcome/" className="W6" target="_blank" rel="noopener noreferrer">「デジクリ」</a>
                  所属。
                </p>
                <p className="W3">
                  2023年2月ごろからケモ耳の女の子をメインに据えた一次創作を中心にイラストを描いています。
                  3DCGで背景を作り、ペイントソフトで背景の着彩とキャラクターの描画を行っています。<br />
                  サークルの企画や個人での同人誌作成のためにDTPやデザインをゆるく勉強中です。
                </p>
                <div className={`${styles.buttonRow}`}>
                  <Link href="/artworks">
                    <div className="button-type1 glass-container-type2">
                      作品を見る
                    </div>
                  </Link>
                  <Link href="/blogs">
                    <div className="button-type1 glass-container-type2">
                      ブログを見る
                    </div>
                  </Link>
                </div>
                <h3>使用ソフトウェア</h3>
                <ul className="W3">
                  <li>Clip Studio Paint</li>
                  <li>Blender</li>
                  <li>Adobe Photoshop</li>
                  <li>Adobe Illustrator</li>
                  <li>Adobe InDesign</li>
                  <li>(Adobe After Effects)</li>
                </ul>{/*
                <h3>作業環境</h3>
                <ul className="W3">
                  <li>CASE : NZXT H510 Elite</li>
                  <li>CPU : Intel Core i5-12400</li>
                  <li>GPU : GeForce RTX 4070</li>
                  <li>RAM : DDR5 64GB</li>
                  <li>Pen-Tablet : XP-Pen Deco 02</li>
                </ul>*/}
                <h3>資格等</h3>
                <ul className="W3">
                  <li>エックス線作業主任者</li>
                  <li>危険物取扱者乙種4類</li>
                </ul>
              </div>
            </section>

            <section>
              <hgroup className="page-head2">
                <h2>"hasuda.org" について</h2>
                <small>About this website.</small>
              </hgroup>
              <div className={`${styles.bio}`} >
                <div>
                  <div className={`${styles.profileAvater} ${styles.HasudaIcon}`}>
                    <HasudaIcon/>
                  </div>
                </div>
                <div className={styles.resume}>
                  <h2>HASUDA.ORG</h2>
                  <small>hasuda's Non-portfolio site</small>
                  <p>
                    hasuda.org は、人類の「ケモ耳美少女化」を画策するトランスヒューマニスト団体です。<span className="W3">嘘です。</span>
                  </p>
                  <p className="W3">
                    当ウェブサイトは蓮田が制作したものたちを公開する場所として用意しました。ポートフォリオサイトと言うには内容の選定がされておらず、アナログデッサンもない上に作品に付すコメントも適当なので、 "Non-portfolio site" と称しています。優しい気持ちでご覧になってください。
                  </p>
                  <p className="W3">
                    個人サイトなのに .org ドメインを使っているのは、これが一番安かったからです。
                  </p>
                </div>
              </div>
            </section>

            <section id="making">
              <hgroup className="page-head2">
                <h2>イラスト制作の工程</h2>
                <small>How my illustrations are made.</small>
              </hgroup>
              <p className={`${styles.makingIntroduction} W3`}>
                Blenderを使った制作フローは、人気イラストレーター
                <a href="https://twitter.com/HOooooZY" className="W6" target="_blank" rel="noopener noreferrer">HOJI氏</a>
                の作品に影響されて取り入れているものです。
                2020年ごろに初めて彼の絵を目にして以来その作風に惚れこんでしまい、今や彼が持つ技術に対する憧れや羨望が私のイラスト制作の原動力となっています。
              </p>
              <h3>背景</h3>
              {[
                { img: "/images/about/104-making1.webp", n: "1.", text: "予め構図ラフを描いておき、それをもとに3DCGで背景をモデリングします。\n3Dモデルは実物の寸法を参考にして作成し、必要に応じてアセットとしてマークしておくことで、次回以降のイラスト制作に使いまわすこともできます。\n使用ソフトウェア : Blender (Ver. 4.2.1)" },
                { img: "/images/about/104-making2.webp", n: "2.", text: "光源やカメラの位置を調整し、レンダリングを行います。\nレンダーはEeveeを、輪郭線の出力にはFreestyleを使用しています。" },
                { img: "/images/about/104-making5.webp", n: "3.", text: "背景の色を塗ります。\n使用ソフトウェア : Clip Studio Paint EX" },
                { img: "/images/about/104-making6.webp", n: "4.", text: "2. で得たBlenderの出力画像に対して 3. で塗った色を乗算レイヤーグループで重ね、さらに乗算やスクリーン、オーバーレイなどのブレンドモードを使って部分的に色調を調整します。" },
              ].map(({ img, n, text }) => (
                <div key={n} className={styles.making}>
                  <Image src={img} alt="イラスト制作の工程" width={400} height={300} style={{ objectFit: "scale-down" }} />
                  <div className={styles.makingText}>
                    <h3>{n}</h3>
                    <p className="W3">{text.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}</p>
                  </div>
                </div>
              ))}
              <h3>キャラクター</h3>
              {[
                { img: "/images/about/104-making3.jpg", n: "5.", text: "キャラクターの下書きをします。" },
                { img: "/images/about/104-making4.jpg", n: "6.", text: "キャラクターの線画を清書します。" },
                { img: "/images/about/104-making7.jpg", n: "7.", text: "キャラクターの色を塗ります。" },
                { img: "/images/artworks/No-104/104-2s.webp", n: "8.", text: "乗算やスクリーン、オーバーレイ、トーンカーブなどで色調補正して完成です。" },
              ].map(({ img, n, text }) => (
                <div key={n} className={styles.making}>
                  <Image src={img} alt="イラスト制作の工程" width={400} height={300} style={{ objectFit: "scale-down" }} />
                  <div className={styles.makingText}>
                    <h3>{n}</h3>
                    <p className="W3">{text}</p>
                  </div>
                </div>
              ))}
            </section>

            <section>
              <hgroup className="page-head2">
                <h2>ガイドライン</h2>
                <small>Guidelines</small>
              </hgroup>
              <p className="W3">
                当ウェブサイトに掲載されている作品の無断転載を禁じます。<br />
                また、知的財産権的な観点で問題を有している生成AIのトレーニング素材として、当ウェブサイトに掲載されている作品を学習させた結果および関連した内容について、公開、複製、配布、譲渡、転載、転売、送信を行うことを禁じます。
              </p>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}
