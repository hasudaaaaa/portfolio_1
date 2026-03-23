import type { Metadata } from "next";
import { getAllBlogs } from "@/lib/getBlogs";
import BlogCard from "@/components/BlogCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "ブログ - hasuda.org",
  alternates: { canonical: "https://hasuda.org/blogs" },
  openGraph: { url: "https://hasuda.org/blogs" },
};

export default function BlogsPage() {
  const blogs = getAllBlogs();

  return (
    <main>
      <div className="layout">
        <div className="main-section">
          <hgroup className="page-head">
            <h1>ブログ</h1>
            <small>BLOG</small>
          </hgroup>
          <article>
            <ul className={styles.blogsList}>
              {blogs.map((blog) => (
                <BlogCard key={blog.number} blog={blog} />
              ))}
            </ul>
          </article>
        </div>
      </div>
    </main>
  );
}
