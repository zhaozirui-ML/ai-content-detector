import { COLORS, SCORE_THRESHOLDS } from '../../utils/constants';

/**
 * 带波纹效果的 AI 概率圆环组件
 * @param {number} percentage - 百分比数值 (0-100)
 * @param {number} size - 圆环大小（像素）
 */
export default function CircularProgress({ percentage, size = 240 }) {
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // 根据评分获取颜色
  const getColor = (pct) => {
    if (pct < SCORE_THRESHOLDS.HUMAN) return COLORS.success;
    if (pct < SCORE_THRESHOLDS.MIXED) return COLORS.warning;
    return COLORS.danger;
  };

  const color = getColor(percentage);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* 波纹效果 - 三个同心圆扩散 */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${color}`,
            opacity: 0.3 - i * 0.1,
          }}
        >
          <div
            className={`absolute inset-0 rounded-full ${
              i === 0 ? 'ripple-effect' : i === 1 ? 'ripple-effect-delay-1' : 'ripple-effect-delay-2'
            }`}
            style={{ border: `2px solid ${color}` }}
          />
        </div>
      ))}

      {/* 主圆环 */}
      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
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
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 12px ${color}40)`,
          }}
        />
      </svg>

      {/* 中心文字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="text-7xl font-black tech-glow" style={{ color }}>
          {percentage}
        </div>
        <div className="text-sm" style={{ color: COLORS.textTertiary }}>
          %
        </div>
        <div className="text-base font-semibold mt-2" style={{ color: COLORS.textPrimary }}>
          AI 疑似度
        </div>
      </div>
    </div>
  );
}
