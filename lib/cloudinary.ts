const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB
export const MAX_VIDEO_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_IMAGES = 3;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

export function validateFile(file: File, kind: "image" | "video"): string | null {
  if (kind === "image") {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Please choose a JPG, PNG, or WEBP image.";
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return "Image must be under 2MB.";
    }
  } else {
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return "Please choose an MP4 or MOV video.";
    }
    if (file.size > MAX_VIDEO_BYTES) {
      return "Video must be under 10MB.";
    }
  }
  return null;
}

export async function uploadToCloudinary(
  file: File,
  kind: "image" | "video",
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary isn't configured — set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }

  const resourceType = kind === "image" ? "image" : "video";
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url as string);
      } else {
        reject(new Error("Upload failed. Please try again."));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed. Please check your connection."));

    xhr.send(formData);
  });
}
