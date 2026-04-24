import { useState } from 'react';
import { COLORS } from '../../utils/constants';

/**
 * 原文展示区组件 - 带聚焦模式
 * @param {string[]} sentences - 句子数组
 * @param {Function} onFocusChange - 聚焦改变回调
 */
export default function TextInspector({ sentences, onFocusChange }) {
  const [focusedIndex, setFocusedIndex] = useState(null);

  if (!sentences || sentences.length === 0) return null;

  const handleSentenceClick = (idx) => {
    const newFocus = focusedIndex === idx ? null : idx;
    setFocusedIndex(newFocus);
    onFocusChange(newFocus);
  };

  return (
    <div className="space-y-3">
      {sentences.map((sentence, idx) => {
        const isFocused = focusedIndex === idx;
        const isDimmed = focusedIndex !== null && !isFocused;

        return (
          <div
            key={idx}
            onClick={() => handleSentenceClick(idx)}
            className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
              isFocused
                ? 'border-blue-500 bg-blue-500/10'
                : isDimmed
                ? 'border-transparent opacity-30'
                : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
            }`}
          >
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>
              <span className="text-xs mr-2" style={{ color: COLORS.textMuted }}>
                #{idx + 1}
              </span>
              {sentence}
            </p>
          </div>
        );
      })}
    </div>
  );
}
