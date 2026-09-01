import React, { useState, useRef, type ChangeEvent } from "react";
import { Image as ImageIcon, X, Loader2, Send } from "lucide-react";
import type { PostBoxProps } from "../types";
import { createPost } from "../api/axios";

const TAG_OPTIONS = ["Project", "Drawing", "Craft", "Science"];

export const PostBox: React.FC<PostBoxProps> = ({
  currentUser,
  onPost,
  placeholder = "Share what you made today...",
  className = "",
}) => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("Project");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e?: React.SubmitEvent) => {
    if (e) e.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent && !selectedImage) return;

    setIsSubmitting(true);
    try {
      if (onPost) {
        await onPost({
          content: trimmedContent,
          image_url: selectedImage || undefined,
        });
      }
      const res = await createPost({
        content: trimmedContent,
        image_url: selectedImage || undefined,
      })
      console.log('posted: ', res)
      setContent("");
      setSelectedImage(null);
    } catch (err) {
      console.error("Failed to publish post:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = content.trim().length > 0 || !!selectedImage;
  const avatarUrl = currentUser?.avatar;

  return (
    <div
      className={`bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border-2 border-[var(--border-subtle)] shadow-sm ${className}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Input Row */}
      <div className="flex gap-3 sm:gap-4 items-start">
        {avatarUrl && (
          <div className="w-10 h-10 rounded-full border-2 border-[var(--primary)] overflow-hidden bg-[var(--bg-input)] shrink-0">
            <img
              src={avatarUrl}
              alt={currentUser?.name || "User"}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="w-full bg-[var(--bg-input)] border border-[var(--border-medium)] focus:border-[var(--primary)] focus:bg-[var(--bg-card)] rounded-xl p-3 text-sm sm:text-base font-medium text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none resize-none transition-colors"
          />

          {/* Image Preview */}
          {selectedImage && (
            <div className="mt-3 relative inline-block">
              <img
                src={selectedImage}
                alt="Attachment preview"
                className="w-32 h-32 object-cover rounded-xl border border-[var(--border-subtle)]"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-[var(--danger)] text-white p-1 rounded-full shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-subtle)] gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-[var(--accent-yellow)] text-[var(--accent-yellow-text)] font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 hover:brightness-95 transition-all cursor-pointer shadow-xs"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photo</span>
              </button>

              {/* Category Tags */}
              <div className="flex items-center gap-1">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors cursor-pointer ${selectedTag === tag
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)]"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!isFormValid || isSubmitting}
              className={`bg-[var(--primary)] text-white font-bold text-sm px-5 py-2 rounded-xl flex items-center gap-2 transition-all ${isFormValid && !isSubmitting
                ? "hover:bg-[var(--primary-hover)] cursor-pointer shadow-sm"
                : "opacity-50 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBox;
