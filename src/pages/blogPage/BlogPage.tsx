import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import supabase from "../../utils/supabase";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import Button from "../../components/buttons/Button";
import { v4 as uuidv4 } from "uuid";

type Blog = {
  id: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  title: string;
  content: string;
  author: string;
};

type Comments = {
  id: string;
  blog_id: string;
  author_id: string;
  username: string;
  content: string;
  image_url: string;
  created_at: string;
};

export default function BlogPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comments[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    async function fetchComments() {
      if (!id) return;
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("blog_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error.message);
        return;
      }

      setComments(data ?? []);
    }

    fetchComments();
  }, [id]);

  if (!blog) {
    return (
      <div className="flex flex-col justify-center items-center gap-4 px-4">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!commentText.trim() && !imageFile) {
      setError("Leave a text or select an image to post a comment!");
      return;
    }

    if (!user) {
      setError("You must be signed in to leave a comment!");
      return;
    }

    if (!id) return;

    setLoading(true);
    setError("");

    let imageUrl: string | null = null;

    
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `comment-images/${id}/${fileName}`;

      

      const {  error: uploadError } = await supabase.storage
        .from("comment-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Upload error:", uploadError); 
        setError(`Failed to upload image: ${uploadError.message}`);
        setLoading(false);
        return;
      }


      const { data } = supabase.storage
        .from("comment-images")
        .getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("comments")
      .insert([
        {
          blog_id: id,
          content: commentText,
          author_id: user.id,
          username: user.email,
          image_url: imageUrl,
        },
      ])
      .select();

    setLoading(false);

    if (insertError) {
      console.error(insertError.message);
      setError(insertError.message);
      return;
    }

    setCommentText("");

    if (data && data.length > 0) {
      setComments((prev) => [data[0], ...prev]); 
      setCommentText("");
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <section>
        <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
        <small className="text-gray-500">
          By {blog.author} | Created at:{" "}
          {new Date(blog.created_at).toLocaleString()}{" "}
          {blog.updated_at
            ? "| Last updated: " + new Date(blog.created_at).toLocaleString()
            : ""}
        </small>

        <p className="mt-4 text-gray-800">{blog.content}</p>
      </section>
      <section className="mt-20">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="border p-2 rounded-md flex flex-col w-full  justify-between gap-4">
            <div className="flex w-full items-center justify-between">
              <input
                type="text"
                placeholder="Leave a comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="focus:outline-0 w-8/10"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="text-slate-600 w-fit h-5 hover:text-slate-950"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                  <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
                </svg>
              </button>
            </div>
            {imageFile && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-fit max-h-40 rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800 mt-1"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          <Button disabled={loading}>{loading ? "Posting..." : "Post"}</Button>
        </form>

        {error && <p className="text-red-600 mt-2">{error}</p>}
      </section>
      <ul className="flex flex-col gap-8 mt-5">
        {comments.length === 0 ? (
          <li className="">
            <p className="text-gray-500">No comments yet</p>
          </li>
        ) : (
          comments.map((comment) => (
            <li key={comment.id} className="bg-stone-200 p-4 rounded-lg">
              <span className="flex gap-4 items-center justify-between">
                <p className="font-semibold">{comment.username}</p>

                <p className="text-sm text-slate-700">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </span>
              <div className="flex flex-col gap-4">
                <p className="mt-2 text-zinc-800">{comment.content}</p>
                {comment.image_url && (
                  <img
                    src={comment.image_url}
                    alt="Preview"
                    className="w-fit max-h-40 rounded"
                  />
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
