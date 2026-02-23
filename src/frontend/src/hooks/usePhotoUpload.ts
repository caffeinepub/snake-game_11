import { useState } from 'react';
import { useSubmitPhoto } from './useQueries';

interface UsePhotoUploadReturn {
  uploadPhoto: (file: File) => Promise<void>;
  isUploading: boolean;
  isSuccess: boolean;
  error: Error | null;
}

export function usePhotoUpload(): UsePhotoUploadReturn {
  const submitPhoto = useSubmitPhoto();
  const [isSuccess, setIsSuccess] = useState(false);

  const uploadPhoto = async (file: File) => {
    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      await submitPhoto.mutateAsync(dataUrl);
      setIsSuccess(true);
    } catch (error) {
      console.error('Photo upload failed:', error);
      throw error;
    }
  };

  return {
    uploadPhoto,
    isUploading: submitPhoto.isPending,
    isSuccess,
    error: submitPhoto.error,
  };
}
