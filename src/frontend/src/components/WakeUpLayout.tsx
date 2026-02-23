import React from 'react';
import { Clock, Award } from 'lucide-react';
import LoginButton from './LoginButton';
import WakeUpSettings from './WakeUpSettings';
import WakeUpTimer from './WakeUpTimer';
import WakeUpHistory from './WakeUpHistory';
import PhotoRequirementModal from './PhotoRequirementModal';

export default function WakeUpLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-wake-dawn via-wake-morning to-wake-sky">
      <header className="border-b border-wake-border bg-wake-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-wake-accent flex items-center justify-center">
                <Clock className="w-6 h-6 text-wake-accent-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-wake-foreground">Wake Up Warrior</h1>
                <p className="text-sm text-wake-muted">战胜赖床，从今天开始</p>
              </div>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-wake-hero-start to-wake-hero-end p-8 md:p-12 text-white shadow-xl">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-12 h-12" />
                <h2 className="text-3xl md:text-4xl font-bold">准时起床挑战</h2>
              </div>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                设定起床时间，如果晚起就必须上传穿好衣服的照片。用承诺和行动战胜赖床！
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </section>

          <div className="grid md:grid-cols-2 gap-6">
            <WakeUpSettings />
            <WakeUpTimer />
          </div>

          <WakeUpHistory />
        </div>
      </main>

      <footer className="border-t border-wake-border bg-wake-card/80 backdrop-blur-sm py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-wake-muted">
          <p>
            © {new Date().getFullYear()} Wake Up Warrior · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'wake-up-warrior'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-wake-accent hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <PhotoRequirementModal />
    </div>
  );
}
