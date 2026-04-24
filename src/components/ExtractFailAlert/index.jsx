import { COLORS } from '../../utils/constants';

/**
 * 内容提取失败提示框组件
 * @param {string} errorMessage - 错误信息
 * @param {Function} onSwitchToManual - 切换到手动粘贴模式的回调
 */
export default function ExtractFailAlert({ errorMessage, onSwitchToManual }) {
  return (
    <div
      className="mb-6 rounded-2xl p-6 border-2 bubble-pop"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
      }}
    >
      <div className="flex items-start gap-4">
        {/* 错误图标 */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          ⚠️
        </div>

        {/* 内容 */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#FCA5A5' }}>
            内容提取失败
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#FCA5A5' }}>
            {errorMessage}
          </p>

          {/* 解决方案 */}
          <div
            className="rounded-lg p-4 mb-4"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: '#FCA5A5' }}>
              💡 推荐方案
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#FECACA' }}>
              请手动复制原文内容，粘贴到下方文本框中进行分析。系统会自动识别句子并进行深度分析。
            </p>
          </div>

          {/* 切换按钮 */}
          <button
            onClick={onSwitchToManual}
            className="w-full px-6 py-3 rounded-xl font-bold transition-all hover:scale-[1.02] text-white flex items-center justify-center gap-2"
            style={{
              backgroundColor: COLORS.primary,
              backgroundImage: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            切换到手动粘贴模式
          </button>
        </div>
      </div>
    </div>
  );
}
