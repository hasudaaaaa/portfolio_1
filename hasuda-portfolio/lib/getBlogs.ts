import blogsData from "@/content/blogs/blogs.json";

export interface BlogData {
  pageURL: string;
  thumbnailPath: string;
  number: string;
  title: string;
  date: string;
}

export function getAllBlogs(): BlogData[] {
  return blogsData as BlogData[];
}
