import React from 'react';
import { useGetPhotoSubmissions, useGetWakeUpTime } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, CheckCircle, AlertCircle, Image } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function WakeUpHistory() {
  const { data: submissions, isLoading: submissionsLoading } = useGetPhotoSubmissions();
  const { data: settings } = useGetWakeUpTime();

  if (submissionsLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-wake-accent" />
            <CardTitle>起床记录</CardTitle>
          </div>
          <CardDescription>查看您的起床历史</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedSubmissions = [...(submissions || [])].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-wake-accent" />
          <CardTitle>起床记录</CardTitle>
        </div>
        <CardDescription>
          共 {submissions?.length || 0} 条记录
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!submissions || submissions.length === 0 ? (
          <div className="text-center py-12 text-wake-muted">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无起床记录</p>
            <p className="text-sm mt-2">开始您的第一次挑战吧！</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {sortedSubmissions.map((submission, index) => {
                const submissionDate = new Date(Number(submission.timestamp) / 1000000);
                const targetDate = settings
                  ? new Date(Number(settings.wakeUpTime) / 1000000)
                  : null;

                let minutesLate = 0;
                if (targetDate) {
                  const target = new Date(
                    submissionDate.getFullYear(),
                    submissionDate.getMonth(),
                    submissionDate.getDate(),
                    targetDate.getHours(),
                    targetDate.getMinutes()
                  );
                  minutesLate = Math.max(
                    0,
                    Math.floor((submissionDate.getTime() - target.getTime()) / 60000)
                  );
                }

                const isLate = minutesLate > 0;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg border border-wake-border bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isLate ? 'bg-destructive/10' : 'bg-wake-success/10'
                      }`}
                    >
                      {isLate ? (
                        <AlertCircle className="w-6 h-6 text-destructive" />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-wake-success" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-wake-foreground">
                          {submissionDate.toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {isLate ? (
                          <Badge variant="destructive" className="text-xs">
                            晚起 {minutesLate} 分钟
                          </Badge>
                        ) : (
                          <Badge className="text-xs bg-wake-success text-white">
                            准时
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-wake-muted">
                        {submissionDate.toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-wake-muted">
                      <Image className="w-4 h-4" />
                      <span className="text-xs">已提交</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
