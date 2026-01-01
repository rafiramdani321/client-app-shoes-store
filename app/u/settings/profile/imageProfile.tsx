import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/hooks/useUsers";
import { showToastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface ImageProfile {
  imageUrl: string;
  imageFileId: string | null;
}

const ImageProfile = ({ imageFileId, imageUrl }: ImageProfile) => {
  const { updateImageProfile, deleteImageProfile } = useUsers();

  const [file, setFile] = React.useState<File | null>(null);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenChooser = () => inputRef.current?.click();

  React.useEffect(() => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
    }
  }, [imageUrl]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selected = files[0];

    if (selected.size > 4 * 1024 * 1024) {
      showToastError("Max file size is 4MB");
      return;
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(selected.type)) {
      showToastError("Only JPG, JPEG, PNG, WEBP allowed");
      return;
    }

    setFile(selected);

    if (previewImage) URL.revokeObjectURL(previewImage);
    const url = URL.createObjectURL(selected);
    setPreviewImage(url);
  };

  const handleCancelChangeImage = () => {
    setPreviewImage(null);
    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDeleteImage = async () => {
    handleCancelChangeImage();
    await deleteImageProfile.mutateAsync();
    setFile(null);
    setPreviewImage(null);
  };

  const handleUpload = async () => {
    if (!file) {
      showToastError("Choose an image first!");
      return;
    }

    await updateImageProfile.mutateAsync([file]);
    setFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="w-[20%] h-fit shrink-0 border p-3 rounded-md shadow-md">
      <div className="relative w-full aspect-square rounded-md overflow-hidden border">
        <Image
          src={previewImage ?? imageUrl}
          alt="image-user"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <Input
        ref={inputRef}
        type="file"
        id="images"
        name="images"
        accept="image/*"
        className="hidden"
        onChange={handleOnChange}
      />
      {previewImage ? (
        <Button
          type="button"
          className="w-full mt-2"
          onClick={handleUpload}
          disabled={
            updateImageProfile.isPending ||
            !file ||
            deleteImageProfile.isPending
          }
        >
          {updateImageProfile.isPending ? "Uploading..." : "Upload"}
        </Button>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full mt-5"
          onClick={handleOpenChooser}
          disabled={
            updateImageProfile.isPending || deleteImageProfile.isPending
          }
        >
          Change Image
        </Button>
      )}
      <div className="mt-2">
        {previewImage ? (
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={handleCancelChangeImage}
            disabled={
              updateImageProfile.isPending || deleteImageProfile.isPending
            }
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="button"
            variant="destructive"
            className={cn("w-full", !imageFileId && "hidden")}
            disabled={
              updateImageProfile.isPending || deleteImageProfile.isPending
            }
            onClick={handleDeleteImage}
          >
            {deleteImageProfile.isPending ? "Deleting..." : "Delete Image"}
          </Button>
        )}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Maximum file size 4 MB. The file extention must be JPG, JPEG, PNG
      </p>
    </div>
  );
};

export default ImageProfile;
