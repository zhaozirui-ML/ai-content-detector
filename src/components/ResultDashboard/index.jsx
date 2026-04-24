import CircularProgress from '../CircularProgress';
import BurstinessLineChart from '../BurstinessLineChart';
import { COLORS, SCORE_THRESHOLDS, SCORE_LABELS } from '../../utils/constants';

/**
 * 结果仪表盘组件 - 左侧栏：固定核心数据区
 * @param {Object} result - 分析结果对象
 */
export default function ResultDashboard({ result }) {
  const getStatusColor = (score) => {
    if (score < SCORE_THRESHOLDS.HUMAN) return COLORS.success;
    if (score < SCORE_THRESHOLDS.MIXED) return COLORS.warning;
    return COLORS.danger;
  };

  const getStatusText = (score) => {
    if (score < SCORE_THRESHOLDS.HUMAN) return SCORE_LABELS.HUMAN;
    if (score < SCORE_THRESHOLDS.MIXED) return SCORE_LABELS.MIXED;
    return SCORE_LABELS.AI;
  };

  return (
    <div className="lg:col-span-1 space-y-4 sticky top-8 max-h-[85vh] overflow-y-auto scrollbar-thin pr-2">
      {/* AI 概率总分圆环 */}
      <div
        className="rounded-2xl p-6 text-center"
        style={{ backgroundColor: COLORS.bgCard, border: '1px solid rgba(59, 130, 246, 0.2)' }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-4"
          style={{ color: COLORS.textTertiary }}
        >
          AI 生成概率
        </h2>
        <CircularProgress percentage={result.ai_score} size={180} />

        {/* 评判标签 */}
        <div
          className="mt-4 px-4 py-2 rounded-full text-sm font-bold border-2"
          style={{
            backgroundColor:
              result.ai_score < SCORE_THRESHOLDS.HUMAN
                ? 'rgba(16, 185, 129, 0.15)'
                : result.ai_score < SCORE_THRESHOLDS.MIXED
                ? 'rgba(245, 158, 11, 0.15)'
                : 'rgba(239, 68, 68, 0.15)',
            color: getStatusColor(result.ai_score),
            borderColor: getStatusColor(result.ai_score),
          }}
        >
          {getStatusText(result.ai_score)}
        </div>

        <p className="mt-4 text-xs leading-relaxed" style={{ color: COLORS.textTertiary }}>
          {result.analysis}
        </p>
      </div>

      {/* 四维度雷达图 */}
      <div
        className="rounded-2xl p-5"
        style={{ backgroundColor: COLORS.bgCard, border: '1px solid rgba(59, 130, 246, 0.2)' }}
      >
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-3"
          style={{ color: COLORS.textTertiary }}
        >
          四维度雷达图
        </h3>
        <div className="flex items-center justify-center">
          <svg width="200" height="180" viewBox="0 0 200 180">
            {/* 雷达图背景网格 */}
            {[0.25, 0.5, 0.75, 1].map((scale, i) => (
              <polygon
                key={i}
                points={`100,${90 - 60 * scale} ${100 + 60 * scale},90 100,${90 + 60 * scale} ${
                  100 - 60 * scale
                },90`}
                fill="none"
                stroke="rgba(107, 114, 128, 0.15)"
                strokeWidth="1"
              />
            ))}
            {/* 轴线 */}
            <line x1="100" y1="30" x2="100" y2="150" stroke="rgba(107, 114, 128, 0.15)" />
            <line x1="40" y1="90" x2="160" y2="90" stroke="rgba(107, 114, 128, 0.15)" />

            {/* 数据多边形 */}
            <polygon
              points={`
                100,${
                  90 -
                  60 *
                    (result.structural_overuse === '高'
                      ? 1
                      : result.structural_overuse === '中'
                      ? 0.6
                      : 0.3)
                }
                ${
                  100 +
                  60 *
                    (result.format_pattern === 'AI型列表'
                      ? 1
                      : result.format_pattern === '混合'
                      ? 0.6
                      : 0.3)
                },90
                100,${
                  90 +
                  60 * (1 - (result.cliche_phrases?.length > 3 ? 1 : result.cliche_phrases?.length > 0 ? 0.6 : 0.2))
                }
                ${
                  100 -
                  60 *
                    (result.emotional_depth === '缺失'
                      ? 0.3
                      : result.emotional_depth === '较弱'
                      ? 0.6
                      : 1)
                },90
              `}
              fill="rgba(59, 130, 246, 0.25)"
              stroke="#3B82F6"
              strokeWidth="2"
              style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' }}
            />

            {/* 数据点 */}
            <circle
              cx="100"
              cy={
                90 -
                60 * (result.structural_overuse === '高' ? 1 : result.structural_overuse === '中' ? 0.6 : 0.3)
              }
              r="4"
              fill="#3B82F6"
            />
            <circle
              cx={
                100 +
                60 * (result.format_pattern === 'AI型列表' ? 1 : result.format_pattern === '混合' ? 0.6 : 0.3)
              }
              cy="90"
              r="4"
              fill="#3B82F6"
            />
            <circle
              cx="100"
              cy={
                90 +
                60 * (1 - (result.cliche_phrases?.length > 3 ? 1 : result.cliche_phrases?.length > 0 ? 0.6 : 0.2))
              }
              r="4"
              fill="#3B82F6"
            />
            <circle
              cx={
                100 -
                60 * (result.emotional_depth === '缺失' ? 0.3 : result.emotional_depth === '较弱' ? 0.6 : 1)
              }
              cy="90"
              r="4"
              fill="#3B82F6"
            />

            {/* 标签 */}
            <text x="100" y="23" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="500">
              结构化
            </text>
            <text x="165" y="94" textAnchor="start" fill="#94A3B8" fontSize="10" fontWeight="500">
              排版
            </text>
            <text x="100" y="168" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="500">
              独特性
            </text>
            <text x="35" y="94" textAnchor="end" fill="#94A3B8" fontSize="10" fontWeight="500">
              情感
            </text>
          </svg>
        </div>
      </div>

      {/* 突发性与困惑度指标 */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📐', label: '结构化过度', value: result.structural_overuse },
            { icon: '💫', label: '情感深度', value: result.emotional_depth },
            { icon: '📝', label: '排版模式', value: result.format_pattern },
            {
              icon: '📈',
              label: '突发性 B值',
              value: (result.burstiness * 100).toFixed(0),
              color: COLORS.primary,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl p-3 transition-all hover:scale-[1.02]"
              style={{ backgroundColor: COLORS.bgCard, border: '1px solid rgba(59, 130, 246, 0.2)' }}
            >
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>
                {item.label}
              </div>
              <div className="text-base font-bold" style={{ color: item.color || COLORS.textPrimary }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* 句长波动可视化 */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: COLORS.bgCard, border: '1px solid rgba(59, 130, 246, 0.2)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xs font-semibold" style={{ color: COLORS.textTertiary }}>
                句长波动
              </h4>
              <p className="text-xs" style={{ color: COLORS.textMuted }}>
                B = σ/μ
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black" style={{ color: COLORS.primary }}>
                {(result.burstiness * 100).toFixed(0)}
              </div>
            </div>
          </div>
          <BurstinessLineChart sentenceLengths={result.sentenceLengths} burstiness={result.burstiness} />
        </div>
      </div>

      {/* 底部特征标签 */}
      <div
        className="rounded-xl p-4"
        style={{ backgroundColor: COLORS.bgCard, border: '1px solid rgba(59, 130, 246, 0.2)' }}
      >
        <h4 className="text-xs font-semibold mb-3" style={{ color: COLORS.textTertiary }}>
          检测摘要
        </h4>
        <div className="space-y-2">
          {[
            { color: '#F59E0B', label: '万能废话', value: result.cliche_phrases?.length || 0, unit: '处' },
            { color: '#F87171', label: 'AI 特征', value: result.ai_signals?.length || 0, unit: '项' },
            { color: '#10B981', label: '人类特征', value: result.human_touch_examples?.length || 0, unit: '项' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs" style={{ color: COLORS.textTertiary }}>
                {item.label}: {item.value} {item.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
