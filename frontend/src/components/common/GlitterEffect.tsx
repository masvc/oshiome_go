import { useEffect, useRef } from 'react';

interface GlitterEffectProps {
  enabled?: boolean;
}

export const GlitterEffect = ({ enabled = true }: GlitterEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const colors = [
      // サイトカラーに合わせた色
      '#FF339D', // oshi-pink-500
      '#FF60B2', // oshi-pink-400
      '#FFB8DC', // oshi-pink-200
      '#FFF0F7', // oshi-pink-50
      '#9173FF', // oshi-purple-500
      '#A78FFF', // oshi-purple-400
      '#D3C7FF', // oshi-purple-200
      '#4f46e5', // oshi-indigo
      '#ffb6c1',
      '#ffc0cb',
      '#fff0f5',
      '#ffd700',
      '#ffffff',
      '#ffe4e1',
    ];
    const maxGlitter = 30; // 画面に表示する最大ラメの数（増やす）

    // ラメのサイズ範囲
    const minSize = 5;
    const maxSize = 15;

    // アニメーション時間の範囲（秒）
    const minDuration = 5;
    const maxDuration = 12;

    // ラメを生成する関数
    const createGlitter = (startY: number) => {
      // 既存のラメの数をチェック
      if (container.children.length >= maxGlitter) {
        // 古いラメを削除
        if (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }

      const glitter = document.createElement('div');
      glitter.className = 'glitter';

      // ランダムな位置、サイズ、色、アニメーション時間を設定
      const size = minSize + Math.random() * (maxSize - minSize);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const animationDuration =
        minDuration + Math.random() * (maxDuration - minDuration);

      // 回転角度をランダムに設定
      const rotation = Math.random() * 360;

      glitter.style.width = `${size}px`;
      glitter.style.height = `${size}px`;
      glitter.style.backgroundColor = color;
      glitter.style.left = `${left}vw`;
      glitter.style.top = `${startY}vh`;
      glitter.style.animationDuration = `${animationDuration}s`;
      glitter.style.transform = `rotate(${rotation}deg)`;
      glitter.style.opacity = '1'; // 初期状態で表示

      container.appendChild(glitter);

      // アニメーション終了後にラメを削除
      setTimeout(() => {
        if (glitter.parentNode === container) {
          container.removeChild(glitter);
        }
      }, animationDuration * 1000);
    };

    // 初期ラメを生成（量を増やす）
    for (let i = 0; i < maxGlitter; i++) {
      createGlitter(Math.random() * 100); // ランダムな初期位置（上から下まで）
    }

    // 定期的に新しいラメを生成（間隔を短くする）
    const intervalId = setInterval(() => {
      createGlitter(-10); // 画面上部から生成
    }, 300); // 間隔を短くする

    // クリーンアップ関数
    return () => {
      clearInterval(intervalId);
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, [enabled]);

  return (
    <div
      ref={containerRef}
      className="glitter-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10, // z-indexを上げる
        overflow: 'hidden',
      }}
    />
  );
};
