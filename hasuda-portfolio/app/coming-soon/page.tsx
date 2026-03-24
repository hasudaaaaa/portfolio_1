import type { Metadata } from "next";
import BackButton from "./BackButton";

export const metadata: Metadata = {
  title: "Coming Soon - hasuda.org",
};

export default function ComingSoon() {
  return (
    <main>
      <div className="layout">
        <div className="main-section">
          <hgroup className="page-head">
            <h1>Coming Soon......</h1>
            <small>準備中......</small>
          </hgroup>
          <article>
            <p>まだなにもないよ</p>
            <div style={{ textAlign: "center", margin: "3rem 0" }}>
              <BackButton />
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
