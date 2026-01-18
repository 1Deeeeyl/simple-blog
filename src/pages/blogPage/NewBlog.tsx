import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
import type { RootState } from "../../store";

export default function NewBlog() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    navigate("/signin", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !content || !author) {
      setError("Title, author, and content cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.from("blogs").insert([
      {
        title,
        author,
        content,
        author_id: user.id, 
      },
    ]);

    setLoading(false);

    if (error) {
      console.error("Error creating blog:", error.message);
      setError(error.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Create New Blog</h2>

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
          className={`p-2 rounded-md text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
}
