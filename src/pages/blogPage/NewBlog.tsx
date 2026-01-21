import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import supabase from "../../utils/supabase";
import type { RootState } from "../../store";
import { v4 as uuidv4 } from "uuid";


export default function NewBlog() {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    let imageUrl: string | null = null;

    
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `comment-images/${user.id}/${fileName}`;

      

      const {  error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, imageFile);

      if (uploadError) {
        console.error("Upload error:", uploadError); 
        setError(`Failed to upload image: ${uploadError.message}`);
        setLoading(false);
        return;
      }


      const { data } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.from("blogs").insert([
      {
        title,
        author,
        content,
        author_id: user.id,
        image_url:imageUrl
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
        className="flex flex-col gap-4 w-full max-w-xl items-center"
      >
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
          className="cursor-pointer bg-green-600 hover:bg-green-700 p-2.5 rounded-md font-medium text-white inline-flex items-center justify-center h-fit w-fit"
          type="button"
        >
          Add Image
        </button>
        {imageFile && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="w-fit max-h-60 rounded"
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
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded-md focus:outline-none focus:border-pink-600 w-full"
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border p-2 rounded-md focus:outline-none focus:border-pink-600 w-full"
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="border p-2 rounded-md focus:outline-none focus:border-pink-600 w-full"
        />

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          className={`p-2.5 rounded-md text-white font-medium ${
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
