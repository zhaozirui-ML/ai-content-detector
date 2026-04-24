import React, { useState, useEffect } from 'react';

/**
 * 打字机效果组件
 * @param {string} text - 要显示的文本
 */
export default function TypewriterText({ text }) {
  const [animation, setAnimation] = useState({ source: text, index: 0 });
  const isTextStale = animation.source !== text;

  // 打字机动画逻辑
  useEffect(() => {
    if (!isTextStale && animation.index < animation.source.length) {
      const timeout = setTimeout(() => {
        setAnimation((prev) => ({ ...prev, index: prev.index + 1 }));
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [animation, isTextStale]);

  // 文本改变时重启动画。这里用渲染期的受控状态同步，避免 effect 中同步 setState 触发 lint 规则。
  if (isTextStale) {
    setAnimation({ source: text, index: 0 });
  }

  const displayText = isTextStale ? '' : animation.source.slice(0, animation.index);

  return <span className="typing-cursor">{displayText}</span>;
}
