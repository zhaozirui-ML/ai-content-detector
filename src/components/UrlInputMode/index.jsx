import { COLORS } from '../../utils/constants';

/**
 * URL 输入模式组件
 * @param {string} text - 输入的URL
 * @param {Function} onChange - 输入改变回调
 * @param {boolean} loading - 是否正在加载
 */
export default function UrlInputMode({ text, onChange, loading }) {
  return (
    <div className="space-y-4">
      {/* URL 输入框 */}
      <div
        className="relative rounded-xl p-4 transition-all duration-300"
        style={{ backgroundColor: COLORS.bgCard, border: '2px solid #334155' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
          >
            🔗
          </div>
          <div className="flex-1">
            <label
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: COLORS.textTertiary }}
            >
              粘贴文章链接
            </label>
            <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
              支持微信公众号、知乎、博客等平台
            </p>
          </div>
        </div>
        <input
          type="text"
          className="w-full bg-transparent text-base leading-relaxed focus:outline-none"
          style={{ color: COLORS.textPrimary }}
          placeholder="https://example.com/article"
          value={text}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* 提示信息 */}
      <div className="flex items-start gap-2 px-2">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
          style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6' }}
        >
          i
        </div>
        <p className="text-xs leading-relaxed" style={{ color: COLORS.textMuted }}>
          系统会自动提取网页内容并分析，无需手动复制文本。
          <span className="font-semibold" style={{ color: COLORS.textTertiary }}>
            {' '}
            支持 Markdown 格式渲染的页面效果更佳。
          </span>
        </p>
      </div>
    </div>
  );
}
