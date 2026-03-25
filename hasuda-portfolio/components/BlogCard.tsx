import Image from "next/image";
import type { BlogData } from "@/lib/getBlogs";
import styles from "./BlogCard.module.css";

export default function BlogCard({ blog }: { blog: BlogData }) {
  const isExternal = blog.pageURL.startsWith("http");
  const isComingSoon = blog.number === "b000";

  return (
    <li className={styles.blogsItem}>
      <a
        href={blog.pageURL}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      >
        <div className={styles.thumbnailFrame}>
          <Image
            src={blog.thumbnailPath}
            alt={blog.title}
            width={280}
            height={157}
            className={styles.thumbnail}
          />
        </div>
        <h3>{blog.title}</h3>
        <div className={`${styles.blogDate} W3`}>
          <small>{isComingSoon ? "" : blog.date}</small>
        </div>
      </a>
    </li>
  );
}
