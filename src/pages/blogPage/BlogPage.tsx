import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";

type Blog = {
  id: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  title: string;
  content: string;
  author: string;
};

export default function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      if (!id) return;
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single(); 

      if (error) {
        console.error(error.message);
        return;
      }

      setBlog(data);
    }

    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 px-4">
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <small className="text-gray-500">
        By {blog.author} | Created at:{" "}
        {new Date(blog.created_at).toLocaleString()}{" "}
        {blog.updated_at
          ? "| Last updated: " + new Date(blog.created_at).toLocaleString()
          : ""}
      </small>

      <p className="mt-4 text-gray-800">{blog.content}</p>
    </div>
  );
}
