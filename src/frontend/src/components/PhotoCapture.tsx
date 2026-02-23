import React, { useState } from 'react';
import { useCamera } from '../camera/useCamera';
import { usePhotoUpload } from '../hooks/usePhotoUpload';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload, RotateCw, Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface PhotoCaptureProps {
  onPhotoSubmitted?: () => void;
}

export default function PhotoCapture({ onPhotoSubmitted }: PhotoCaptureProps) {
  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading: cameraLoading,
    currentFacingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: 'user', quality: 0.8 });

  const { uploadPhoto, isUploading, isSuccess } = usePhotoUpload();
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      setCapturedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      await stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setCapturedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      toast.error('请选择有效的图片文件');
    }
  };

  const handleSubmit = async () => {
    if (!capturedFile) return;

    try {
      await uploadPhoto(capturedFile);
      toast.success('照片已提交！');
      onPhotoSubmitted?.();
    } catch (error) {
      console.error('Failed to upload photo:', error);
      toast.error('上传失败，请重试');
    }
  };

  const handleRetake = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setCapturedFile(null);
    setPreviewUrl(null);
  };

  if (isSuccess) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-wake-success/10 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-wake-success" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-wake-success">提交成功！</h3>
          <p className="text-wake-muted mt-2">您已完成今日挑战</p>
        </div>
      </div>
    );
  }

  if (previewUrl) {
    return (
      <div className="space-y-4">
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
        </div>
        <div className="flex gap-3">
          <Button onClick={handleRetake} variant="outline" className="flex-1" disabled={isUploading}>
            重拍
          </Button>
          <Button onClick={handleSubmit} className="flex-1 gap-2" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                提交照片
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="camera" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="camera">拍照</TabsTrigger>
        <TabsTrigger value="upload">上传</TabsTrigger>
      </TabsList>

      <TabsContent value="camera" className="space-y-4">
        {isSupported === false && (
          <Alert variant="destructive">
            <AlertDescription>您的设备不支持相机功能</AlertDescription>
          </Alert>
        )}

        {cameraError && (
          <Alert variant="destructive">
            <AlertDescription>{cameraError.message}</AlertDescription>
          </Alert>
        )}

        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ display: isActive ? 'block' : 'none' }}
          />
          {!isActive && !cameraLoading && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <p>相机未启动</p>
            </div>
          )}
          {cameraLoading && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="flex gap-3">
          {!isActive ? (
            <Button onClick={startCamera} disabled={cameraLoading || isSupported === false} className="flex-1 gap-2">
              {cameraLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  启动中...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  启动相机
                </>
              )}
            </Button>
          ) : (
            <>
              <Button onClick={handleCapture} disabled={cameraLoading} className="flex-1 gap-2">
                <Camera className="w-4 h-4" />
                拍照
              </Button>
              {currentFacingMode && (
                <Button onClick={() => switchCamera()} variant="outline" disabled={cameraLoading} className="gap-2">
                  <RotateCw className="w-4 h-4" />
                  切换
                </Button>
              )}
            </>
          )}
        </div>
      </TabsContent>

      <TabsContent value="upload" className="space-y-4">
        <div className="border-2 border-dashed border-wake-border rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 mx-auto mb-4 text-wake-muted" />
          <p className="text-sm text-wake-muted mb-4">选择一张照片上传</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              选择文件
            </label>
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
