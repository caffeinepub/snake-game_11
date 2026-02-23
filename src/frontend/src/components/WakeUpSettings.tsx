import React, { useState, useEffect } from 'react';
import { useGetWakeUpTime, useSetWakeUpTime } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Clock, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function WakeUpSettings() {
  const { data: settings, isLoading } = useGetWakeUpTime();
  const setWakeUpTime = useSetWakeUpTime();

  const [hour, setHour] = useState('7');
  const [minute, setMinute] = useState('0');
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (settings) {
      const date = new Date(Number(settings.wakeUpTime) / 1000000);
      setHour(date.getHours().toString());
      setMinute(date.getMinutes().toString());
      setIsEnabled(settings.isEnabled);
    }
  }, [settings]);

  const handleSave = async () => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hour), parseInt(minute));
    const wakeUpTime = BigInt(targetDate.getTime()) * BigInt(1000000);

    try {
      await setWakeUpTime.mutateAsync({
        wakeUpTime,
        isEnabled,
      });
      toast.success('起床时间已保存');
    } catch (error) {
      console.error('Failed to save wake-up time:', error);
      toast.error('保存失败，请重试');
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-wake-accent" />
          <CardTitle>设置起床时间</CardTitle>
        </div>
        <CardDescription>选择您的目标起床时间</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="enabled">启用起床挑战</Label>
          <Switch id="enabled" checked={isEnabled} onCheckedChange={setIsEnabled} />
        </div>

        <div className="space-y-4">
          <Label>起床时间</Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={hour} onValueChange={setHour}>
                <SelectTrigger>
                  <SelectValue placeholder="小时" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h.padStart(2, '0')} 时
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="text-2xl font-bold text-wake-muted">:</span>
            <div className="flex-1">
              <Select value={minute} onValueChange={setMinute}>
                <SelectTrigger>
                  <SelectValue placeholder="分钟" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m.padStart(2, '0')} 分
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-wake-accent/10 border border-wake-accent/20">
          <p className="text-sm text-wake-foreground">
            <span className="font-semibold">当前设置：</span>
            {isEnabled ? (
              <>
                每天 {hour.padStart(2, '0')}:{minute.padStart(2, '0')} 起床
              </>
            ) : (
              '挑战已禁用'
            )}
          </p>
        </div>

        <Button onClick={handleSave} disabled={setWakeUpTime.isPending || !isEnabled} className="w-full gap-2">
          <Save className="w-4 h-4" />
          {setWakeUpTime.isPending ? '保存中...' : '保存设置'}
        </Button>
      </CardContent>
    </Card>
  );
}
