import { HasudaIcon } from "@/components/icons/hasuda-icon";
import styles from "./LoadingScreen.module.css";

type Props = {
  isExiting?: boolean;
};

export default function LoadingScreen({ isExiting = false }: Props) {
  return (
    <div
      className={`${styles.loadingScreen} ${isExiting ? styles.isExiting : ""}`}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className={styles.iconShell} aria-hidden="true">
        <HasudaIcon />
      </div>
    </div>
  );
}
