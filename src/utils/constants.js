// 颜色常量
export const COLORS = {
  // 主色调 - 科技蓝
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  primaryGlow: 'rgba(59, 130, 246, 0.3)',

  // 背景色
  bgMain: '#0F172A',
  bgCard: '#1E293B',
  bgCardHover: '#374151',

  // 文字色
  textPrimary: '#F1F5F9',
  textSecondary: '#E2E8F0',
  textTertiary: '#94A3B8',
  textMuted: '#6B7280',

  // 边框色
  border: 'rgba(51, 65, 85, 0.5)',
  borderLight: 'rgba(59, 130, 246, 0.4)',
  borderSubtle: 'rgba(107, 114, 128, 0.2)',

  // 状态色
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',

  // 高亮色
  highlight: 'rgba(59, 130, 246, 0.15)',
};

// 评分相关常量
export const SCORE_THRESHOLDS = {
  HUMAN: 40,
  MIXED: 70,
};

export const SCORE_LABELS = {
  HUMAN: '🧑 可能是人类创作',
  MIXED: '🤖 混合内容',
  AI: '⚠️ 高度疑似 AI',
};

// 文案常量
export const TEXTS = {
  APP_TITLE: 'AI 内容深度检测',
  APP_SUBTITLE: '基于 GLM-4 模型 · 多维度智能分析',
  BUTTON_START: '开始检测',
  BUTTON_ANALYZING: '检测中...',
  BUTTON_DOWNLOAD: '保存分析报告',
  BUTTON_DOWNLOADING: '生成中...',
  BUTTON_RESET: '重新检测',
  LOADING_DEFAULT: '正在分析...',
  LOADING_EXTRACTION: '正在提取网页内容...',
  LOADING_ANALYSIS: '正在分析内容...',
};
