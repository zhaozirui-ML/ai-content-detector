/**
 * SVG 折线图组件 - 可视化突发性 B = σ/μ
 * @param {number[]} sentenceLengths - 句子长度数组
 * @param {number} burstiness - 突发性值
 */
export default function BurstinessLineChart({ sentenceLengths, burstiness }) {
  if (!sentenceLengths || sentenceLengths.length === 0) return null;

  // 限制显示的数据点数量（最多30个）
  let displayLengths = sentenceLengths;
  if (sentenceLengths.length > 30) {
    const step = sentenceLengths.length / 30;
    displayLengths = [];
    for (let i = 0; i < 30; i++) {
      displayLengths.push(sentenceLengths[Math.floor(i * step)]);
    }
  }

  const maxLength = Math.max(...displayLengths);
  const minLength = Math.min(...displayLengths);
  const range = maxLength - minLength || 1;

  const width = 320;
  const height = 80;
  const padding = 8;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // 计算所有点的坐标
  const points = displayLengths.map((len, idx) => {
    const x = padding + (idx / (displayLengths.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((len - minLength) / range) * chartHeight;
    return { x, y, value: len };
  });

  // 生成折线路径
  const linePath = points.map((p, idx) => (idx === 0 ? 'M' : 'L') + `${p.x},${p.y}`).join(' ');

  // 生成填充区域路径
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - padding} L${points[0].x},${
    height - padding
  } Z`;

  return (
    <div className="w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 填充区域 */}
        <path d={areaPath} fill="url(#areaGradient)" opacity="0.5" />

        {/* 折线 */}
        <path
          d={linePath}
          stroke="url(#lineGradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="line-draw-animation"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }}
        />

        {/* 数据点 */}
        {points.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#3B82F6"
            className="point-pop-animation"
            style={{ animationDelay: `${idx * 30}ms` }}
          />
        ))}
      </svg>

      {/* 公式说明 */}
      <div
        className="flex items-center justify-between mt-3 text-xs"
        style={{ color: '#6B7280' }}
      >
        <span>句长波动图</span>
        <span>B = σ/μ = {burstiness.toFixed(2)}</span>
      </div>
    </div>
  );
}
