import React, { useState } from 'react';
import { useWakeUpTimer } from '../hooks/useWakeUpTimer';
import { useGetPhotoSubmissions } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PhotoCapture from './PhotoCapture';
import { AlertCircle } from 'lucide-react';

export default function PhotoRequirementModal() {
  const { isLate, minutesLate, isEnabled } = useWakeUpTimer();
  const { data: submissions } = useGetPhotoSubmissions();
  const [photoSubmitted, setPhotoSubmitted] = useState(false);

  const today = new Date().toDateString();
  const hasSubmittedToday = submissions?.some((sub) => {
    const subDate = new Date(Number(sub.timestamp) / 1000000);
    return subDate.toDateString() === today;
  });

  const showModal = isEnabled && isLate && !hasSubmittedToday && !photoSubmitted;

  const handlePhotoSubmitted = () => {
    setPhotoSubmitted(true);
  };

  return (
    <Dialog open={showModal}>
      <DialogContent
        className="sm:max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <DialogTitle className="text-center text-2xl">需要上传照片</DialogTitle>
          <DialogDescription className="text-center text-base">
            您已晚起 <span className="font-bold text-destructive">{minutesLate}</span> 分钟
            <br />
            请上传一张穿好衣服的照片以完成今日挑战
          </DialogDescription>
        </DialogHeader>
        <PhotoCapture onPhotoSubmitted={handlePhotoSubmitted} />
      </DialogContent>
    </Dialog>
  );
}
