import TypewriterText from '../TypewriterText';

/**
 * 加载遮罩层组件
 * @param {string} status - 状态文本
 */
export default function LoadingOverlay({ status }) {
  return (
    <div
      className="absolute inset-0 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)' }}
    >
      {/* 光束扫描效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="beam-animation absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
      </div>

      {/* 中心图标 */}
      <div className="relative z-10 mb-6">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* 打字机状态文本 */}
      <div className="relative z-10 text-center">
        <p className="text-lg font-medium mb-2" style={{ color: '#3B82F6' }}>
          <TypewriterText text={status || '正在分析...'} />
        </p>
        <p className="text-sm" style={{ color: '#6B7280' }}>请稍候，AI 正在努力工作中</p>
      </div>

      {/* 底部进度条 */}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#1E293B' }}>
        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  );
}
