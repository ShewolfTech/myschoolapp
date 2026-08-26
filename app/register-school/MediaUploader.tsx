"use client";

import { useRef, useState } from "react";
import {
  uploadToCloudinary,
  validateFile,
  MAX_IMAGES,
} from "@/lib/cloudinary";

export function MediaUploader({
  images,
  onImagesChange,
  video,
  onVideoChange,
}: {
  images: string[];
  onImagesChange: (images: string[]) => void;
  video: string;
  onVideoChange: (video: string) => void;
}) {
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // allow selecting the same file again later

    setImageError(null);

    if (images.length >= MAX_IMAGES) {
      setImageError(`You can only add up to ${MAX_IMAGES} photos.`);
      return;
    }

    const validationError = validateFile(file, "image");
    if (validationError) {
      setImageError(validationError);
      return;
    }

    setImageUploading(true);
    setImageProgress(0);
    try {
      const url = await uploadToCloudinary(file, "image", setImageProgress);
      onImagesChange([...images, url]);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setImageUploading(false);
    }
  }

  async function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setVideoError(null);

    const validationError = validateFile(file, "video");
    if (validationError) {
      setVideoError(validationError);
      return;
    }

    setVideoUploading(true);
    setVideoProgress(0);
    try {
      const url = await uploadToCloudinary(file, "video", setVideoProgress);
      onVideoChange(url);
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setVideoUploading(false);
    }
  }

  function removeImage(url: string) {
    onImagesChange(images.filter((img) => img !== url));
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-ink-soft mb-2">
          Photos (up to {MAX_IMAGES}, 2MB each — JPG, PNG, or WEBP)
        </label>
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative w-24 h-24 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="School photo"
                className="w-24 h-24 object-cover rounded-sm border border-ink-soft/30"
              />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-2 -right-2 bg-margin-red text-paper-white w-6 h-6 rounded-full text-sm font-semibold flex items-center justify-center"
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={imageUploading}
              className="w-24 h-24 shrink-0 rounded-sm border-2 border-dashed border-ink-soft/40 flex flex-col items-center justify-center text-ink-soft hover:border-chalkboard hover:text-chalkboard transition-colors disabled:opacity-60"
            >
              {imageUploading ? (
                <span className="font-ledger text-xs">{imageProgress}%</span>
              ) : (
                <>
                  <span className="text-2xl leading-none">+</span>
                  <span className="text-xs mt-1">Add photo</span>
                </>
              )}
            </button>
          )}
        </div>
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageSelect}
          className="hidden"
        />
        {imageError && <p className="text-sm text-margin-red mt-2">{imageError}</p>}
      </div>

      <div>
        <label className="block text-sm text-ink-soft mb-2">
          Video (optional, up to 10MB — MP4 or MOV)
        </label>
        {video ? (
          <div className="relative w-full max-w-xs">
            <video src={video} controls className="w-full rounded-sm border border-ink-soft/30" />
            <button
              type="button"
              onClick={() => onVideoChange("")}
              className="absolute -top-2 -right-2 bg-margin-red text-paper-white w-6 h-6 rounded-full text-sm font-semibold flex items-center justify-center"
              aria-label="Remove video"
            >
              ×
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            disabled={videoUploading}
            className="w-full max-w-xs h-24 rounded-sm border-2 border-dashed border-ink-soft/40 flex flex-col items-center justify-center text-ink-soft hover:border-chalkboard hover:text-chalkboard transition-colors disabled:opacity-60"
          >
            {videoUploading ? (
              <span className="font-ledger text-xs">{videoProgress}%</span>
            ) : (
              <>
                <span className="text-2xl leading-none">+</span>
                <span className="text-xs mt-1">Add video</span>
              </>
            )}
          </button>
        )}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/quicktime"
          onChange={handleVideoSelect}
          className="hidden"
        />
        {videoError && <p className="text-sm text-margin-red mt-2">{videoError}</p>}
      </div>
    </div>
  );
}
