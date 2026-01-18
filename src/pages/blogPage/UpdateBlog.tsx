import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../utils/supabase";
import type { RootState } from "../../store";

export default function UpdateBlog() {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/signin", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchBlog() {
      if (!id) return;

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        navigate("/");
        return;
      }
      if (!user) {
        navigate("/");
        return;
      }
      if (data.author_id !== user.id) {
        navigate("/");
        return;
      }

      setTitle(data.title);
      setAuthor(data.author);
      setContent(data.content);
      setLoading(false);
    }

    fetchBlog();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !content || !author) {
      setError("Title, author, and content cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("blogs")
      .update({
        title,
        author,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate(`/blogs/${id}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 px-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-xl"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded-md focus:outline-none focus:border-pink-600"
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 rounded-md focus:outline-none focus:border-pink-600"
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="border p-2 rounded-md focus:outline-none focus:border-pink-600"
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded-md text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
          }`}
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
