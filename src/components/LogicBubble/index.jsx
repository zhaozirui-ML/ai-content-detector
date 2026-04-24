import { COLORS } from '../../utils/constants';

/**
 * 判定逻辑气泡框组件 - 支持分段分析
 * @param {string} sentence - 选中的句子
 * @param {number} sentenceIndex - 句子索引
 * @param {Array} detailedSegments - 详细分段分析
 * @param {Function} onClose - 关闭回调
 */
export default function LogicBubble({ sentence, sentenceIndex, detailedSegments, onClose }) {
  if (!sentence) return null;

  // 从 detailedSegments 中查找对应的特定分析
  const segmentDetail = detailedSegments?.find((seg) => seg.sentence_index === sentenceIndex);

  // 如果找到特定分析，使用它；否则使用兜底文案
  const specificReason =
    segmentDetail?.specific_reason ||
    '该段落表现正常，无明显 AI 特征。句子结构自然，用词表达流畅，符合人类写作习惯。';
  const hasAIFeature = !!segmentDetail;

  return (
    <div
      className="bubble-pop fixed right-8 top-1/2 transform -translate-y-1/2 w-[420px] rounded-2xl shadow-2xl border z-50"
      style={{
        backgroundColor: COLORS.bgCard,
        borderColor: hasAIFeature ? COLORS.danger : COLORS.primary,
      }}
    >
      {/* 气泡框箭头 */}
      <div
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2 w-4 h-4 rotate-45"
        style={{
          backgroundColor: COLORS.bgCard,
          borderLeft: `2px solid ${hasAIFeature ? COLORS.danger : COLORS.primary}`,
          borderBottom: `2px solid ${hasAIFeature ? COLORS.danger : COLORS.primary}`,
        }}
      />

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-slate-700/50"
        style={{ color: COLORS.textTertiary }}
      >
        ✕
      </button>

      {/* 内容 */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl`}
            style={{
              backgroundColor: hasAIFeature ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            }}
          >
            {hasAIFeature ? '⚠️' : '✅'}
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ color: COLORS.textPrimary }}>
              {hasAIFeature ? 'AI 特征检测' : 'GLM-4 分析结果'}
            </h3>
            <p className="text-xs" style={{ color: COLORS.textTertiary }}>
              句子 #{sentenceIndex + 1} · {hasAIFeature ? '发现 AI 痕迹' : '无明显异常'}
            </p>
          </div>
        </div>

        <div
          className="mb-4 p-3 rounded-lg"
          style={{
            backgroundColor: hasAIFeature ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          }}
        >
          <p className="text-xs mb-1" style={{ color: COLORS.textTertiary }}>
            选中段落
          </p>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>
            {sentence}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div
              className={`w-2 h-2 rounded-full mt-1.5`}
              style={{ backgroundColor: hasAIFeature ? COLORS.danger : COLORS.success }}
            />
            <div className="flex-1">
              <p className="text-xs font-semibold mb-2" style={{ color: COLORS.textPrimary }}>
                {hasAIFeature ? 'AI 特征说明' : '判定结果'}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textTertiary }}>
                {specificReason}
              </p>
            </div>
          </div>

          {hasAIFeature && (
            <div
              className="mt-4 p-3 rounded-lg"
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: '#F59E0B' }} />
                <div className="flex-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: '#FBBF24' }}>
                    优化建议
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#FECACA' }}>
                    建议修改该段落的表述方式，增加个人观点和独特表达，避免使用万能过渡词和生硬的结构化表达。
                  </p>
                </div>
              </div>
            </div>
          )}

          <div
            className="flex items-start gap-2 mt-4 pt-3"
            style={{ borderTop: '1px solid rgba(59, 130, 246, 0.1)' }}
          >
            <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: COLORS.primary }} />
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: COLORS.textPrimary }}>
                技术依据
              </p>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.textTertiary }}>
                基于多维度分析：结构化程度、词汇多样性、句长变化幅度、情感色彩等指标综合判定。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
