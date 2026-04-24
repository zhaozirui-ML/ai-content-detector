import React from 'react';

// 颜色常量 - 全部使用 Hex 格式，兼容 html2canvas
const COLORS = {
  // 主色调 - 科技蓝
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  primaryGlow: 'rgba(59, 130, 246, 0.3)',

  // 背景色
  bgMain: '#111827',      // 深灰蓝背景
  bgCard: '#1F2937',      // 卡片背景
  bgCardHover: '#374151', // 卡片悬停

  // 文字色
  white: '#F9FAFB',       // 主要文字
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB', // 次要文字
  textTertiary: '#9CA3AF',  // 辅助文字
  textMuted: '#6B7280',     // 弱化文字

  // 边框色
  border: 'rgba(59, 130, 246, 0.2)',
  borderLight: 'rgba(59, 130, 246, 0.4)',
  borderSubtle: 'rgba(107, 114, 128, 0.2)',

  // 状态色
  success: '#10B981',     // 绿色 - 人类创作
  warning: '#F59E0B',     // 橙色 - 混合
  danger: '#EF4444',      // 红色 - AI生成

  // 高亮色
  highlight: 'rgba(59, 130, 246, 0.15)',
};

// 海报专用圆环进度条组件
function PosterCircularProgress({ percentage, size = 220 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (pct) => {
    if (pct < 40) return COLORS.success;
    if (pct < 70) return COLORS.warning;
    return COLORS.danger;
  };

  const color = getColor(percentage);
  const glowColor = color === COLORS.success
    ? 'rgba(16, 185, 129, 0.4)'
    : color === COLORS.warning
    ? 'rgba(245, 158, 11, 0.4)'
    : 'rgba(239, 68, 68, 0.4)';

  return (
    <div style={{ width: size, height: size }} className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(107, 114, 128, 0.2)"
          strokeWidth="14"
          fill="none"
        />
        {/* 进度圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="14"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 12px ${glowColor})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-6xl font-black" style={{ color }}>
          {percentage}
        </div>
        <div className="text-sm" style={{ color: COLORS.textTertiary }}>%</div>
        <div className="text-base font-semibold mt-2" style={{ color: COLORS.textPrimary }}>
          AI 疑似度总分
        </div>
      </div>
    </div>
  );
}

// 海报专用雷达图组件
function PosterRadarChart({ result }) {
  const getScore = (type) => {
    switch (type) {
      case '高':
      case 'AI型列表':
        return 1;
      case '中':
      case '混合':
        return 0.6;
      case '缺失':
      case '低':
      case '人类散文':
      case '丰富':
        return 0.3;
      case '较弱':
        return 0.6;
      default:
        return 0.5;
    }
  };

  // 情感深度分数需要反转（缺失=低分，丰富=高分）
  const emotionalScore = result.emotional_depth === '缺失' ? 0.3 : result.emotional_depth === '较弱' ? 0.6 : 1;

  const centerX = 140;
  const centerY = 120;
  const radius = 80;

  return (
    <svg width="280" height="240" viewBox="0 0 280 240">
      {/* 背景网格 */}
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <polygon
          key={i}
          points={`${centerX},${centerY - radius * scale} ${centerX + radius * scale},${centerY} ${centerX},${centerY + radius * scale} ${centerX - radius * scale},${centerY}`}
          fill="none"
          stroke="rgba(107, 114, 128, 0.15)"
          strokeWidth="1"
        />
      ))}
      {/* 轴线 */}
      <line x1={centerX} y1={centerY - radius} x2={centerX} y2={centerY + radius} stroke="rgba(107, 114, 128, 0.15)" />
      <line x1={centerX - radius} y1={centerY} x2={centerX + radius} y2={centerY} stroke="rgba(107, 114, 128, 0.15)" />

      {/* 数据多边形 */}
      <polygon
        points={`
          ${centerX},${centerY - radius * getScore(result.structural_overuse)}
          ${centerX + radius * getScore(result.format_pattern)},${centerY}
          ${centerX},${centerY + radius * (1 - (result.cliche_phrases?.length > 3 ? 1 : result.cliche_phrases?.length > 0 ? 0.6 : 0.2))}
          ${centerX - radius * emotionalScore},${centerY}
        `}
        fill="rgba(59, 130, 246, 0.25)"
        stroke={COLORS.primary}
        strokeWidth="2.5"
        style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))' }}
      />

      {/* 数据点 */}
      <circle cx={centerX} cy={centerY - radius * getScore(result.structural_overuse)} r="5" fill={COLORS.primary} />
      <circle cx={centerX + radius * getScore(result.format_pattern)} cy={centerY} r="5" fill={COLORS.primary} />
      <circle cx={centerX} cy={centerY + radius * (1 - (result.cliche_phrases?.length > 3 ? 1 : result.cliche_phrases?.length > 0 ? 0.6 : 0.2))} r="5" fill={COLORS.primary} />
      <circle cx={centerX - radius * emotionalScore} cy={centerY} r="5" fill={COLORS.primary} />

      {/* 标签 */}
      <text x={centerX} y="28" textAnchor="middle" fill={COLORS.textTertiary} fontSize="12" fontWeight="500">结构化</text>
      <text x={centerX + radius + 15} y={centerY + 4} textAnchor="start" fill={COLORS.textTertiary} fontSize="12" fontWeight="500">排版</text>
      <text x={centerX} y={centerY + radius + 20} textAnchor="middle" fill={COLORS.textTertiary} fontSize="12" fontWeight="500">独特性</text>
      <text x={centerX - radius - 15} y={centerY + 4} textAnchor="end" fill={COLORS.textTertiary} fontSize="12" fontWeight="500">情感</text>
    </svg>
  );
}

// 原文高亮片段组件
function HighlightedTextSample({ result }) {
  // 如果有 AI 特征信号，取第一个作为示例
  const sampleText = result.ai_signals && result.ai_signals.length > 0
    ? result.ai_signals[0]
    : result.analysis || "暂无示例文本";

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>原文高亮片段示例</h4>
        <span className="text-xs" style={{ color: COLORS.textMuted }}>AI 特征片段</span>
      </div>
      <div
        className="p-4 rounded-lg border-l-4"
        style={{
          backgroundColor: COLORS.highlight,
          borderColor: COLORS.primary
        }}
      >
        <p className="text-sm leading-relaxed" style={{ color: COLORS.textSecondary }}>
          "{sampleText}"
        </p>
      </div>
    </div>
  );
}

// 主海报组件
export default function AnalysisPoster({ result, date }) {
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const getStatusColor = (score) => {
    if (score < 40) return COLORS.success;
    if (score < 70) return COLORS.warning;
    return COLORS.danger;
  };

  const getStatusText = (score) => {
    if (score < 40) return '🧑 可能是人类创作';
    if (score < 70) return '🤖 混合内容';
    return '⚠️ 高度疑似 AI';
  };

  return (
    <div
      id="analysis-poster"
      className="relative w-[900px] rounded-2xl overflow-hidden"
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        backgroundColor: COLORS.bgMain,
        color: COLORS.textPrimary,
        padding: '48px'
      }}
    >
      {/* 背景装饰 - 科技蓝光晕 */}
      <div className="absolute inset-0" style={{ opacity: 0.03, pointerEvents: 'none' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl" style={{ backgroundColor: COLORS.primary }} />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full blur-3xl" style={{ backgroundColor: COLORS.primary }} />
      </div>

      {/* 顶部装饰线 */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: `linear-gradient(90deg, transparent, ${COLORS.primary}, transparent)`,
        opacity: 0.5
      }} />

      {/* 内容区域 */}
      <div className="relative z-10">
        {/* 顶部标题区 */}
        <div className="flex items-center justify-between mb-10 pb-6" style={{ borderBottom: `1px solid ${COLORS.borderSubtle}` }}>
          <div>
            <h1 className="text-3xl font-black mb-2" style={{ color: COLORS.white, letterSpacing: '-0.5px' }}>
              AI 内容深度检测报告
            </h1>
            <p className="text-sm" style={{ color: COLORS.textMuted }}>
              基于 GLM-4 模型分析 · 多维度智能检测
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>生成时间</div>
            <div className="text-base font-mono" style={{ color: COLORS.textSecondary }}>{formatDate(date)}</div>
          </div>
        </div>

        {/* 主要内容区 - 左右布局 */}
        <div className="flex gap-8">
          {/* 左侧 - AI 疑似度总分 */}
          <div className="w-1/2 flex flex-col items-center justify-center py-6">
            <PosterCircularProgress percentage={result.ai_score} size={240} />

            {/* 评判标签 */}
            <div
              className="mt-6 px-6 py-3 rounded-full text-base font-bold border-2"
              style={{
                backgroundColor: result.ai_score < 40
                  ? 'rgba(16, 185, 129, 0.15)'
                  : result.ai_score < 70
                  ? 'rgba(245, 158, 11, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
                color: getStatusColor(result.ai_score),
                borderColor: getStatusColor(result.ai_score)
              }}
            >
              {getStatusText(result.ai_score)}
            </div>

            {/* 分析摘要 */}
            <div className="mt-6 text-center max-w-xs">
              <p className="text-base leading-relaxed" style={{ color: COLORS.textSecondary }}>
                {result.analysis}
              </p>
            </div>
          </div>

          {/* 右侧 - 雷达图和指标 */}
          <div className="w-1/2 space-y-5">
            {/* 雷达图卡片 */}
            <div
              className="rounded-xl p-6"
              style={{
                backgroundColor: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`
              }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: COLORS.textSecondary }}>
                四维度分析雷达图
              </h3>
              <div className="flex justify-center">
                <PosterRadarChart result={result} />
              </div>
            </div>

            {/* 指标卡片 - 困惑度和突发性 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 困惑度指标 */}
              <div
                className="rounded-xl p-5"
                style={{
                  backgroundColor: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: COLORS.highlight }}>
                    📊
                  </div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>困惑度</div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black" style={{ color: COLORS.primary }}>
                    {result.structural_overuse === '高' ? '低' : result.structural_overuse === '中' ? '中' : '高'}
                  </div>
                </div>
                <div className="text-xs mt-2" style={{ color: COLORS.textMuted }}>
                  {result.structural_overuse === '高' ? 'AI倾向于简单表达' : '文本复杂性较高'}
                </div>
              </div>

              {/* 突发性指标 */}
              <div
                className="rounded-xl p-5"
                style={{
                  backgroundColor: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: COLORS.highlight }}>
                    📈
                  </div>
                  <div className="text-xs" style={{ color: COLORS.textMuted }}>突发性 B值</div>
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black" style={{ color: COLORS.primary }}>
                    {(result.burstiness * 100).toFixed(0)}
                  </div>
                </div>
                <div className="text-xs mt-2" style={{ color: COLORS.textMuted }}>
                  {result.burstiness < 0.3 ? '平缓 (AI特征)' : result.burstiness < 0.6 ? '中等' : '参差 (人类特征)'}
                </div>
              </div>
            </div>

            {/* 核心指标 - 结构化过度、情感深度、排版模式 */}
            <div
              className="rounded-xl p-5"
              style={{
                backgroundColor: COLORS.bgCard,
                border: `1px solid ${COLORS.border}`
              }}
            >
              <h4 className="text-xs font-semibold mb-4 uppercase" style={{ color: COLORS.textTertiary }}>
                详细指标
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg mb-1">📐</div>
                  <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>结构化过度</div>
                  <div className="text-lg font-bold" style={{ color: COLORS.white }}>{result.structural_overuse}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg mb-1">💫</div>
                  <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>情感深度</div>
                  <div className="text-lg font-bold" style={{ color: COLORS.white }}>{result.emotional_depth}</div>
                </div>
                <div className="text-center">
                  <div className="text-lg mb-1">📝</div>
                  <div className="text-xs mb-2" style={{ color: COLORS.textMuted }}>排版模式</div>
                  <div className="text-base font-bold" style={{ color: COLORS.white }}>{result.format_pattern}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部 - 原文高亮片段 */}
        <div
          className="mt-8 rounded-xl p-6"
          style={{
            backgroundColor: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`
          }}
        >
          <HighlightedTextSample result={result} />
        </div>

        {/* 底部版权和页脚 */}
        <div className="mt-10 pt-6 flex items-center justify-between" style={{ borderTop: `1px solid ${COLORS.borderSubtle}` }}>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.primary }} />
              <span className="text-xs" style={{ color: COLORS.textMuted }}>GLM-4 Flash 模型</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.success }} />
              <span className="text-xs" style={{ color: COLORS.textMuted }}>多维度分析</span>
            </div>
          </div>
          <p className="text-xs" style={{ color: COLORS.textMuted }}>
            本报告仅供参考 · AI检测结果可能存在偏差
          </p>
        </div>
      </div>
    </div>
  );
}
