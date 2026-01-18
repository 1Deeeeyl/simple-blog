import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase";
import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";

type Blog = {
  id: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  title: string;
  content: string;
};

export default function YourBlogs() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchBlogs() {
      setLoading(true);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("author_id", user?.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      }

      setBlogs(data ?? []);
      setHasMore((data?.length ?? 0) === PAGE_SIZE);
      setLoading(false);
    }

    fetchBlogs();
  }, [user, page]);

  const handleDelete = async (blogId: string, blogTitle: string) => {
    if (!user) return;

    const confirmed = confirm(`Delete "${blogTitle}"? This cannot be undone.`);

    if (!confirmed) return; 

    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", blogId)
      .eq("author_id", user.id);

    if (error) {
      console.error("Error deleting blog:", error.message);
      return;
    }

    
    setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
  };

  if (!user) {
    return <p className="mt-8">You must be signed in to view your blogs.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold mt-8">Your Blogs</h2>

      {loading && (
        <div className="flex flex-col justify-center items-center gap-4 ">
          <p>Loading...</p>
        </div>
      )}

      {!loading && blogs.length === 0 && <p>No blogs yet.</p>}

      {!loading && blogs.length > 0 && (
        <ul className="flex flex-col gap-4 mt-4 w-full max-w-xl px-4">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="border p-4 rounded-md bg-white border-slate-500"
            >
              <div className="flex items-center justify-between pb-2">
                <Link to={`/blogs/${blog.id}`}>
                  <h3 className="font-semibold text-lg hover:text-blue-600 underline underline-offset-2">
                    {blog.title}
                  </h3>
                </Link>

                <div className="flex gap-2">
                  <Button to={`/yourblogs/${blog.id}/edit`}>Edit</Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(blog.id, blog.title)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <p className="text-gray-800 mt-2">
                {blog.content.length > 100
                  ? blog.content.slice(0, 100) + "..."
                  : blog.content}
              </p>

              <span className="flex flex-col gap-2 md:gap-4 md:flex-row pt-4">
                <small className="text-gray-500">
                  Created at: {new Date(blog.created_at).toLocaleString()}
                </small>
                <small className="text-gray-500">
                  {blog.updated_at
                    ? "Last updated: " +
                      new Date(blog.created_at).toLocaleString()
                    : ""}
                </small>
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-4 my-15">
        <Button
          variant="secondary"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>

        <span className="flex items-center text-sm">Page {page}</span>

        <Button onClick={() => setPage((p) => p + 1)} disabled={!hasMore}>
          Next
        </Button>
      </div>
    </div>
  );
}
