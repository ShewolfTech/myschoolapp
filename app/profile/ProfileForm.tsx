"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar } from "../Avatar";
import { uploadToCloudinary, validateFile } from "@/lib/cloudinary";

export function ProfileForm({
  currentName,
  currentImage,
}: {
  currentName: string;
  currentImage: string | null;
}) {
  const { update } = useSession();
  const [name, setName] = useState(currentName);
  const [image, setImage] = useState<string | null>(currentImage);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setError(null);
    const validationError = validateFile(file, "image");
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadToCloudinary(file, "image", setUploadProgress);
      setImage(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image: image ?? "" }),
    });
    const data = await res.json();

    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    await update({ name: data.name, image: data.image });
    setSuccess(true);
  }

  return (
    <div className="bg-paper-white border border-ink-soft/30 rounded-sm p-8">
      <h1 className="font-display text-2xl font-semibold text-chalkboard mb-1">
        My profile
      </h1>
      <p className="text-sm text-ink-soft mb-6">
        Choose how your name and photo appear across the app — including on
        any reviews you leave.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar name={name || "?"} image={image} size={72} />
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-paper-dark text-ink font-ledger text-sm rounded-sm px-4 py-2 hover:brightness-95 disabled:opacity-60"
            >
              {uploading ? `Uploading... ${uploadProgress}%` : "Change photo"}
            </button>
            {image && (
              <button
                type="button"
                onClick={() => setImage(null)}
                className="block mt-2 text-xs text-ink-soft hover:text-margin-red"
              >
                Remove photo (use default)
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoSelect}
            className="hidden"
          />
        </div>

        <div>
          <label className="block text-sm text-ink-soft mb-1" htmlFor="name">
            Display name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-ink-soft/40 rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-chalkboard"
          />
          <p className="text-xs text-ink-soft/70 mt-1">
            Doesn&apos;t have to be your real name — use whatever you&apos;re
            comfortable showing publicly.
          </p>
        </div>

        {error && <p className="text-sm text-margin-red">{error}</p>}
        {success && (
          <p className="text-sm text-chalkboard bg-paper-dark rounded-sm px-4 py-3">
            Saved.
          </p>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-chalkboard text-paper-white font-ledger text-sm rounded-sm py-3 hover:brightness-110 transition-all disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
