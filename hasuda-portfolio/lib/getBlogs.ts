import blogsData from "@/content/blogs/blogs.json";

export interface BlogData {
  pageURL: string;
  thumbnailPath: string;
  number: string;
  title: string;
  date: string;
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    const html = await res.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export async function getAllBlogs(): Promise<BlogData[]> {
  const blogs = blogsData as BlogData[];
  return Promise.all(
    blogs.map(async (blog) => {
      if (!blog.pageURL.startsWith("http")) return blog;
      const ogImage = await fetchOgImage(blog.pageURL);
      return ogImage ? { ...blog, thumbnailPath: ogImage } : blog;
    })
  );
}
