import React, { useState } from "react";
import axios from "axios";

// 计算突发性 (Burstiness) 的函数：B = σ / μ
// σ 是标准差，μ 是平均值
// 返回 { burstiness, sentenceLengths } 对象
function calculateBurstiness(text) {
  if (!text || text.trim().length === 0) return { burstiness: 0, sentenceLengths: [] };

  // 将文本按句子分割
  const sentences = text
    .split(/[。！？.!?]/)
    .filter((s) => s.trim().length > 0);
  if (sentences.length < 2) return { burstiness: 0, sentenceLengths: [] };

  // 计算每个句子的长度
  const sentenceLengths = sentences.map((s) => s.trim().length);

  // 计算平均值
  const mean =
    sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  if (mean === 0) return { burstiness: 0, sentenceLengths };

  // 计算标准差
  const variance =
    sentenceLengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) /
    sentenceLengths.length;
  const stdDev = Math.sqrt(variance);

  // 突发性 = 标准差 / 平均值
  const burstiness = stdDev / mean;

  // 归一化到 0-1 范围（通常突发性值在 0-2 之间，人类写作通常在 0.5-1.5）
  return {
    burstiness: Math.min(1, Math.max(0, burstiness / 2)),
    sentenceLengths
  };
}

// 句子长度柱状图组件 - 可视化突发性
function SentenceLengthChart({ lengths, maxBars = 20 }) {
  if (!lengths || lengths.length === 0) return null;
  
  // 限制显示的柱子数量，均匀采样
  let displayLengths = lengths;
  if (lengths.length > maxBars) {
    const step = lengths.length / maxBars;
    displayLengths = [];
    for (let i = 0; i < maxBars; i++) {
      displayLengths.push(lengths[Math.floor(i * step)]);
    }
  }
  
  const maxLength = Math.max(...displayLengths);
  const barWidth = 100 / displayLengths.length;
  
  return (
    <div className="w-full h-12 flex items-end gap-[1px] mt-2">
      {displayLengths.map((len, idx) => {
        const heightPercent = maxLength > 0 ? (len / maxLength) * 100 : 0;
        return (
          <div
            key={idx}
            className="flex-1 bg-brand rounded-t-sm transition-all duration-300 hover:bg-brand-light"
            style={{
              height: `${Math.max(heightPercent, 8)}%`,
              opacity: 0.5 + (heightPercent / 200)
            }}
            title={`句子 ${idx + 1}: ${len} 字`}
          />
        );
      })}
    </div>
  );
}

// AI 概率圆环组件
function CircularProgress({ percentage, size = 200 }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // 根据百分比确定颜色
  const getColor = (pct) => {
    if (pct < 40) return "#08A86D"; // 品牌色（低概率）
    if (pct < 70) return "#F59E0B"; // 黄色（中等）
    return "#EF4444"; // 红色（高概率）
  };

  const color = getColor(percentage);

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 背景圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth="12"
          fill="none"
        />
        {/* 进度圆环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-black" style={{ color }}>
          {percentage}%
        </div>
        <div className="text-sm text-slate-400 mt-1">AI 概率</div>
      </div>
    </div>
  );
}

// 打字机效果组件
function TypewriterText({ text }) {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className="typing-cursor">{displayText}</span>
  );
}

// 加载遮罩层组件
function LoadingOverlay({ status }) {
  return (
    <div className="absolute inset-0 bg-[#0F0F0F]/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center overflow-hidden glow-animation">
      {/* 光束扫描效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="beam-animation absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-brand/30 to-transparent" />
      </div>
      
      {/* 中心图标 */}
      <div className="relative z-10 mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-brand/30 border-t-brand animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-brand rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* 打字机状态文本 */}
      <div className="relative z-10 text-center">
        <p className="text-lg font-medium text-brand mb-2">
          <TypewriterText text={status || "正在分析..."} />
        </p>
        <p className="text-sm text-slate-500">请稍候，AI 正在努力工作中</p>
      </div>
      
      {/* 底部进度条 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
        <div className="h-full bg-gradient-to-r from-brand to-brand-light animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  );
}

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyzeContent = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setLoadingStatus("");
    setError(null);

    try {
      const API_KEY = import.meta.env.VITE_ZHIPU_API_KEY;
      if (!API_KEY) {
        throw new Error(
          "未配置 API Key，请在 .env 文件中设置 VITE_ZHIPU_API_KEY"
        );
      }

      // 检测是否为 URL
      const urlPattern = /^https?:\/\/.+/i;
      let contentToAnalyze = text.trim();
      
      if (urlPattern.test(contentToAnalyze)) {
        // 如果是 URL，使用 Jina AI Reader 抓取内容
        setLoadingStatus("正在提取网页内容...");
        const jinaUrl = `https://r.jina.ai/${contentToAnalyze}`;
        const jinaResponse = await fetch(jinaUrl);
        
        if (!jinaResponse.ok) {
          throw new Error("无法获取网页内容，请检查链接是否正确");
        }
        
        contentToAnalyze = await jinaResponse.text();
        
        if (!contentToAnalyze || contentToAnalyze.trim().length < 50) {
          throw new Error("提取的网页内容过少，请检查链接是否有效");
        }
      }
      
      // 开始 AI 分析
      setLoadingStatus("正在分析内容...");

      // 计算突发性（使用提取后的内容）
      const { burstiness, sentenceLengths } = calculateBurstiness(contentToAnalyze);

      const response = await axios.post(
        "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        {
          model: "glm-4-flash",
          messages: [
            {
              role: "system",
              content: `你是 AI 内容检测专家。你现在收到的是一篇文章的 Markdown 格式文本内容（不是 URL）。请从以下四个维度深度分析文本的 AI 生成特征：

**1. 结构化过度检测**
- 检查每个小标题后的段落字数是否惊人地一致
- AI 倾向于生成等长的段落，而人类写作长度变化更自然

**2. 万能废话识别**
- 检测典型的 AI 开场白："在这个飞速发展的时代"、"综上所述"、"值得注意的是"、"首先/其次/再次"
- 标记出所有疑似 AI 生成的万能过渡词

**3. 情感缺失分析**
- 判断文中有无作者个人的主观视角、独特措辞习惯（人类特征）
- 还是纯粹的客观陈述、中立语气（AI 特征）
- AI 难以模拟真实的个人情感和观点

**4. 排版逻辑判断**
- AI 偏好：标准列表（1. 2. 3.）、规整的小标题、对称的结构
- 人类偏好：散文化叙述、流畅的段落过渡、不规则的节奏

请严格返回 JSON 格式（不要有其他文字）：
{
  "ai_score": 0-100 的数值,
  "structural_overuse": "低/中/高",
  "cliche_phrases": ["检测到的万能废话"],
  "emotional_depth": "缺失/较弱/丰富",
  "format_pattern": "AI型列表/人类散文/混合",
  "analysis": "50字以内的总体分析",
  "human_touch_examples": ["发现的人类特征（如有）"],
  "ai_signals": ["发现的所有AI特征"]
}`,
            },
            {
              role: "user",
              content: contentToAnalyze,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const content = response.data.choices[0].message.content;
      let parsedResult;

      try {
        const jsonMatch =
          content.match(/```json\s*([\s\S]*?)\s*```/) ||
          content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
        parsedResult = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error("JSON 解析失败:", parseError);
        parsedResult = {
          ai_score: 50,
          structural_overuse: "中",
          cliche_phrases: [],
          emotional_depth: "较弱",
          format_pattern: "混合",
          analysis: content,
          human_touch_examples: [],
          ai_signals: [],
        };
      }

      // 添加突发性数据
      parsedResult.burstiness = burstiness;
      parsedResult.sentenceLengths = sentenceLengths;
      setResult(parsedResult);
    } catch (err) {
      console.error("检测失败:", err);
      setError(
        err.response?.data?.error?.message ||
          err.message ||
          "检测失败，请检查 API Key 配置"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">
            AI 含量检测小助手
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            作为数字产品设计师，用技术洞察文本背后的算法痕迹。
          </p>
        </header>

        <main className="space-y-6 md:space-y-8">
          {/* 输入区域 */}
          <div className="relative bg-[#1A1A1A] border border-slate-800/50 rounded-2xl shadow-lg p-4 md:p-6">
            {/* Loading 遮罩层 */}
            {loading && <LoadingOverlay status={loadingStatus} />}
            
            <textarea
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none resize-none text-base md:text-lg leading-relaxed"
              placeholder="粘贴微信文章链接或文本内容进行 AI 检测..."
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={analyzeContent}
                disabled={!text.trim() || loading}
                className="bg-brand hover:bg-brand-light active:scale-95 px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-brand/30 text-white"
              >
                {loading ? "检测中..." : "开始检测"}
              </button>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-900/20 border border-red-800/50 text-red-400 px-6 py-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Bento Grid 结果展示 */}
          {result && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Bento Grid 主布局 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                
                {/* 左侧大卡片 - AI 总分 */}
                <div className="lg:col-span-1 lg:row-span-2 bg-[#1A1A1A] border border-brand/20 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-6">
                    AI 生成概率
                  </h2>
                  <CircularProgress percentage={result.ai_score} size={220} />
                  <p className="text-slate-400 mt-6 text-center text-sm max-w-xs leading-relaxed">
                    {result.analysis}
                  </p>
                  {/* 评判标签 */}
                  <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-medium ${
                    result.ai_score < 40 
                      ? 'bg-brand/20 text-brand border border-brand/30' 
                      : result.ai_score < 70 
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {result.ai_score < 40 ? '🧑 可能是人类创作' : result.ai_score < 70 ? '🤖 混合内容' : '⚠️ 高度疑似 AI'}
                  </div>
                </div>

                {/* 右上 - 雷达图卡片 (四维度可视化) */}
                <div className="lg:col-span-2 bg-[#1A1A1A] border border-brand/20 rounded-2xl p-6">
                  <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
                    四维度雷达图
                  </h2>
                  <div className="flex items-center justify-center">
                    <svg width="280" height="240" viewBox="0 0 280 240">
                      {/* 雷达图背景网格 */}
                      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                        <polygon
                          key={i}
                          points={`140,${120 - 80 * scale} ${140 + 80 * scale},120 140,${120 + 80 * scale} ${140 - 80 * scale},120`}
                          fill="none"
                          stroke="rgba(148, 163, 184, 0.1)"
                          strokeWidth="1"
                        />
                      ))}
                      {/* 轴线 */}
                      <line x1="140" y1="40" x2="140" y2="200" stroke="rgba(148, 163, 184, 0.1)" />
                      <line x1="60" y1="120" x2="220" y2="120" stroke="rgba(148, 163, 184, 0.1)" />
                      
                      {/* 数据多边形 */}
                      <polygon
                        points={`
                          140,${120 - 80 * (result.structural_overuse === '高' ? 1 : result.structural_overuse === '中' ? 0.6 : 0.3)}
                          ${140 + 80 * (result.format_pattern === 'AI型列表' ? 1 : result.format_pattern === '混合' ? 0.6 : 0.3)},120
                          140,${120 + 80 * (1 - (result.cliche_phrases?.length > 3 ? 1 : result.cliche_phrases?.length > 0 ? 0.6 : 0.2))}
                          ${140 - 80 * (result.emotional_depth === '缺失' ? 0.3 : result.emotional_depth === '较弱' ? 0.6 : 1)},120
                        `}
                        fill="rgba(8, 168, 109, 0.2)"
                        stroke="#08A86D"
                        strokeWidth="2"
                        className="drop-shadow-lg"
                      />
                      
                      {/* 数据点 */}
                      <circle cx="140" cy={120 - 80 * (result.structural_overuse === '高' ? 1 : result.structural_overuse === '中' ? 0.6 : 0.3)} r="5" fill="#08A86D" />
                      <circle cx={140 + 80 * (result.format_pattern === 'AI型列表' ? 1 : result.format_pattern === '混合' ? 0.6 : 0.3)} cy="120" r="5" fill="#08A86D" />
                      <circle cx="140" cy={120 + 80 * (1 - (result.cliche_phrases?.length > 3 ? 1 : result.cliche_phrases?.length > 0 ? 0.6 : 0.2))} r="5" fill="#08A86D" />
                      <circle cx={140 - 80 * (result.emotional_depth === '缺失' ? 0.3 : result.emotional_depth === '较弱' ? 0.6 : 1)} cy="120" r="5" fill="#08A86D" />
                      
                      {/* 标签 */}
                      <text x="140" y="25" textAnchor="middle" className="fill-slate-400 text-xs">结构化</text>
                      <text x="235" y="124" textAnchor="start" className="fill-slate-400 text-xs">排版</text>
                      <text x="140" y="225" textAnchor="middle" className="fill-slate-400 text-xs">独特性</text>
                      <text x="45" y="124" textAnchor="end" className="fill-slate-400 text-xs">情感</text>
                    </svg>
                  </div>
                </div>

                {/* 右下 - 核心指标卡片网格 */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* 结构化过度 */}
                  <div className="bg-[#1A1A1A] border border-brand/20 rounded-xl p-4 hover:border-brand/40 transition-all">
                    <div className="text-2xl mb-2">📐</div>
                    <div className="text-xs text-slate-500 mb-1">结构化过度</div>
                    <div className="text-xl font-bold text-white">{result.structural_overuse}</div>
                  </div>
                  
                  {/* 情感深度 */}
                  <div className="bg-[#1A1A1A] border border-brand/20 rounded-xl p-4 hover:border-brand/40 transition-all">
                    <div className="text-2xl mb-2">💫</div>
                    <div className="text-xs text-slate-500 mb-1">情感深度</div>
                    <div className="text-xl font-bold text-white">{result.emotional_depth}</div>
                  </div>
                  
                  {/* 排版模式 */}
                  <div className="bg-[#1A1A1A] border border-brand/20 rounded-xl p-4 hover:border-brand/40 transition-all">
                    <div className="text-2xl mb-2">📝</div>
                    <div className="text-xs text-slate-500 mb-1">排版模式</div>
                    <div className="text-lg font-bold text-white">{result.format_pattern}</div>
                  </div>
                  
                  {/* 突发性 - 扩展卡片带柱状图 */}
                  <div className="bg-[#1A1A1A] border border-brand/20 rounded-xl p-4 hover:border-brand/40 transition-all col-span-2 md:col-span-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">突发性 B值</div>
                        <div className="text-xl font-bold text-brand">{(result.burstiness * 100).toFixed(0)}</div>
                      </div>
                      <div className="text-xs text-slate-500 text-right">
                        {result.burstiness < 0.3 ? '平缓 (AI)' : result.burstiness < 0.6 ? '中等' : '参差 (人类)'}
                      </div>
                    </div>
                    <SentenceLengthChart lengths={result.sentenceLengths} maxBars={16} />
                  </div>
                </div>
              </div>

              {/* 底部详情区域 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* 万能废话 */}
                <div className="bg-[#1A1A1A] border border-brand/20 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
                    <span>🔄</span> 万能废话 ({result.cliche_phrases?.length || 0})
                  </h3>
                  {result.cliche_phrases && result.cliche_phrases.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.cliche_phrases.slice(0, 5).map((phrase, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-500/10 text-orange-300 rounded text-xs border border-orange-500/20">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">未检测到明显废话</p>
                  )}
                </div>

                {/* AI 特征 */}
                <div className="bg-[#1A1A1A] border border-red-900/30 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                    <span>⚠️</span> AI 特征
                  </h3>
                  {result.ai_signals && result.ai_signals.length > 0 ? (
                    <ul className="space-y-1">
                      {result.ai_signals.slice(0, 3).map((signal, idx) => (
                        <li key={idx} className="text-slate-400 text-xs flex items-start">
                          <span className="text-red-400 mr-1.5">•</span>
                          <span className="line-clamp-1">{signal}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-sm">未检测到明显特征</p>
                  )}
                </div>

                {/* 人类特征 */}
                <div className="bg-[#1A1A1A] border border-brand/30 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-brand mb-3 flex items-center gap-2">
                    <span>✨</span> 人类特征
                  </h3>
                  {result.human_touch_examples && result.human_touch_examples.length > 0 ? (
                    <ul className="space-y-1">
                      {result.human_touch_examples.slice(0, 3).map((example, idx) => (
                        <li key={idx} className="text-slate-400 text-xs flex items-start">
                          <span className="text-brand mr-1.5">•</span>
                          <span className="line-clamp-1">{example}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-sm">未检测到明显特征</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
