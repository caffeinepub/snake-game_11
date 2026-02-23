import React from 'react';
import { useWakeUpTimer } from '../hooks/useWakeUpTimer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function WakeUpTimer() {
  const { isLate, minutesLate, currentTime, targetTime, isEnabled } = useWakeUpTimer();

  if (!isEnabled) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-wake-muted" />
            <CardTitle>起床状态</CardTitle>
          </div>
          <CardDescription>挑战未启用</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-wake-muted">
            <p>请先设置起床时间并启用挑战</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isLate ? 'border-destructive' : 'border-wake-success'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-wake-accent" />
            <CardTitle>起床状态</CardTitle>
          </div>
          {isLate ? (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="w-3 h-3" />
              晚起
            </Badge>
          ) : (
            <Badge className="gap-1 bg-wake-success text-white">
              <CheckCircle className="w-3 h-3" />
              准时
            </Badge>
          )}
        </div>
        <CardDescription>实时监控您的起床时间</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-wake-muted">当前时间</p>
            <p className="text-2xl font-bold text-wake-foreground">{currentTime}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-wake-muted">目标时间</p>
            <p className="text-2xl font-bold text-wake-accent">{targetTime}</p>
          </div>
        </div>

        {isLate && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-destructive flex-shrink-0" />
              <div>
                <p className="font-semibold text-destructive">您已晚起 {minutesLate} 分钟</p>
                <p className="text-sm text-destructive/80 mt-1">
                  请上传穿好衣服的照片以完成今日挑战
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLate && (
          <div className="p-4 rounded-lg bg-wake-success/10 border border-wake-success/20">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-wake-success flex-shrink-0" />
              <div>
                <p className="font-semibold text-wake-success">太棒了！</p>
                <p className="text-sm text-wake-success/80 mt-1">
                  您还没有晚起，继续保持！
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
