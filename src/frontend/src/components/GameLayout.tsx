import React from 'react';
import SnakeGame from './SnakeGame';
import { SiCoffeescript } from 'react-icons/si';

const GameLayout: React.FC = () => {
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'snake-game';

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-bg-start to-game-bg-end flex flex-col">
      <header className="py-6 px-8 border-b border-game-border/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-game-accent to-game-secondary">
            贪吃蛇游戏
          </h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-game-card/50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-game-border/50">
            <SnakeGame />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-game-primary/30 rounded-lg p-4 border border-game-border/30">
                <h3 className="text-lg font-semibold text-game-accent mb-3">游戏说明</h3>
                <ul className="space-y-2 text-game-text-secondary text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-game-accent mt-0.5">▸</span>
                    <span>使用方向键控制蛇的移动方向</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-game-accent mt-0.5">▸</span>
                    <span>吃到食物可以增加分数和长度</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-game-accent mt-0.5">▸</span>
                    <span>撞到墙壁或自己的身体会游戏结束</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-game-accent mt-0.5">▸</span>
                    <span>按空格键可以暂停/继续游戏</span>
                  </li>
                </ul>
              </div>

              <div className="bg-game-primary/30 rounded-lg p-4 border border-game-border/30">
                <h3 className="text-lg font-semibold text-game-accent mb-3">游戏技巧</h3>
                <ul className="space-y-2 text-game-text-secondary text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-game-accent mt-0.5">▸</span>
                    <span>尽量保持在中央区域活动</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-game-accent mt-0.5">▸</span>
                    <span>提前规划移动路线避免困住自己</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-game-accent mt-0.5">▸</span>
                    <span>分数越高，蛇的移动速度越快</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-game-accent mt-0.5">▸</span>
                    <span>保持冷静，不要慌张操作</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-8 border-t border-game-border/30 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <p className="text-game-text-secondary text-sm flex items-center justify-center gap-2">
            Built with <SiCoffeescript className="text-game-accent" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-game-accent hover:text-game-accent/80 font-semibold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-game-text-secondary/60 text-xs mt-2">
            © {new Date().getFullYear()} Snake Game. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GameLayout;
