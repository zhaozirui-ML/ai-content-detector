import { COLORS } from '../../utils/constants';

/**
 * 手动粘贴模式组件
 * @param {string} text - 输入的文本
 * @param {Function} onChange - 输入改变回调
 * @param {boolean} loading - 是否正在加载
 * @param {Function} onBackToUrl - 返回URL模式的回调
 */
export default function TextInputMode({ text, onChange, loading, onBackToUrl }) {
  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
          >
            📝
          </div>
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: COLORS.textTertiary }}
            >
              手动粘贴文本
            </label>
            <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
              粘贴任意文章内容进行分析
            </p>
          </div>
        </div>
        <button
          onClick={onBackToUrl}
          className="px-4 py-2 rounded-lg text-xs font-medium transition-all"
          style={{
            backgroundColor: COLORS.bgCard,
            color: COLORS.textTertiary,
            border: '1px solid #334155',
          }}
        >
          ← 返回 URL 模式
        </button>
      </div>

      {/* 大文本框 */}
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-500"
        style={{ backgroundColor: COLORS.bgCard, border: '2px solid #3B82F6' }}
      >
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: '#3B82F6' }}
          />
        </div>

        <textarea
          className="relative z-10 w-full h-64 bg-transparent focus:outline-none resize-none text-base leading-relaxed p-6"
          style={{ color: COLORS.textPrimary }}
          placeholder={`请粘贴文章内容...

建议：
• 最少 200 字以上
• 支持中英文混合
• 可以包含段落、列表等格式`}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
        />

        {/* 字数统计 */}
        <div
          className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg text-xs"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', color: COLORS.textTertiary }}
        >
          {text.trim().length} 字
        </div>
      </div>
    </div>
  );
}
