import { COLORS } from '../../utils/constants';

/**
 * 探照灯空状态组件
 * 在没有分析结果时显示的引导界面
 */
export default function InspectorEmptyState() {
  return (
    <div
      className="rounded-2xl p-12 text-center"
      style={{
        backgroundColor: COLORS.bgCard,
        border: '1px solid rgba(59, 130, 246, 0.2)',
      }}
    >
      {/* 空状态图标 */}
      <div
        className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl bubble-pop"
        style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
      >
        🔍
      </div>

      <h3 className="text-xl font-bold mb-3" style={{ color: COLORS.textPrimary }}>
        等待输入内容...
      </h3>
      <p
        className="text-sm leading-relaxed mb-6 max-w-md mx-auto"
        style={{ color: COLORS.textTertiary }}
      >
        粘贴文章链接或文本后，点击"开始检测"即可查看原文探照灯功能。
        <br />
        系统会自动分割句子并标注 AI 特征。
      </p>

      {/* 功能预览 */}
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
        {[
          { icon: '🎯', label: '聚焦段落' },
          { icon: '🤖', label: 'AI 判定' },
          { icon: '📊', label: '深度分析' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg p-3"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
          >
            <div className="text-lg mb-1">{item.icon}</div>
            <div className="text-xs" style={{ color: COLORS.textMuted }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
