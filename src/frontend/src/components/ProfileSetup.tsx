import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useSaveUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useUserProfile();
  const saveProfile = useSaveUserProfile();
  const [name, setName] = useState('');

  const showProfileSetup = isFetched && userProfile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('请输入您的名字');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim(), email: undefined });
      toast.success('个人资料已保存');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('保存失败，请重试');
    }
  };

  return (
    <Dialog open={showProfileSetup && !saveProfile.isPending}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-wake-accent/10 flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-wake-accent" />
          </div>
          <DialogTitle className="text-center">完善个人资料</DialogTitle>
          <DialogDescription className="text-center">
            首次登录，请告诉我们您的名字
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名字</Label>
            <Input
              id="name"
              placeholder="请输入您的名字"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? '保存中...' : '保存'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
