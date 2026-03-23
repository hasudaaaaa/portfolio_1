import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContents}>
        <div className={`${styles.footerRow1} ${styles.footerLine}`}>
          <div>
            <h1 className={styles.logo}>HASUDA.ORG</h1>
            <h2>Hasuda&apos;s Portfolio site</h2>
          </div>
          <ul className={styles.snsLinks}>
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
        </div>
        <div className={styles.footerRow1}>
          <div></div>
          <small className={styles.copyright}>© hasuda All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
