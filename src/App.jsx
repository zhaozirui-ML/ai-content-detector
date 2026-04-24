import React, { useState } from 'react';
import AnalysisPoster from './components/AnalysisPoster';

// UI 组件
import UrlInputMode from './components/UrlInputMode';
import TextInputMode from './components/TextInputMode';
import LoadingOverlay from './components/LoadingOverlay';
import ExtractFailAlert from './components/ExtractFailAlert';
import InspectorEmptyState from './components/InspectorEmptyState';
import ResultDashboard from './components/ResultDashboard';
import TextInspector from './components/TextInspector';
import LogicBubble from './components/LogicBubble';

// 自定义 Hooks
import { useContentAnalyzer } from './hooks/useContentAnalyzer';
import { usePosterDownload } from './hooks/usePosterDownload';

// 常量
import { COLORS, TEXTS } from './utils/constants';
import { isEmpty } from './utils/validators';

/**
 * AI 内容深度检测 - 主应用组件
 * 重构后：极简架构，仅负责组装和状态协调
 */
function App() {
  // ==================== 本地状态 ====================
  const [text, setText] = useState('');
  const [focusedSentenceIndex, setFocusedSentenceIndex] = useState(null);

  // ==================== 自定义 Hooks ====================
  const {
    loading,
    loadingStatus,
    error,
    result,
    inputMode,
    setInputMode,
    extractFailed,
    setExtractFailed,
    extractError,
    setExtractError,
    analyzeContent,
    reset,
  } = useContentAnalyzer();

  const { isDownloading, downloadPoster } = usePosterDownload();

  // ==================== 事件处理器 ====================
  const handleAnalyze = () => {
    setFocusedSentenceIndex(null);
    analyzeContent(text);
  };

  const handleReset = () => {
    setFocusedSentenceIndex(null);
    reset();
    setText('');
  };

  const handleSwitchToManual = () => {
    setInputMode('text');
    setExtractFailed(false);
    setText('');
  };

  const handleBackToUrl = () => {
    setInputMode('url');
    setExtractFailed(false);
    setText('');
    setExtractError('');
  };

  // ==================== 渲染 ====================
  return (
    <div className="min-h-screen p-4 md:p-8 font-sans" style={{ backgroundColor: COLORS.bgMain, color: COLORS.textPrimary }}>
      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            {TEXTS.APP_TITLE}
          </h1>
          <p className="mt-2 text-sm md:text-base" style={{ color: COLORS.textTertiary }}>
            {TEXTS.APP_SUBTITLE}
          </p>
        </header>

        <main className="space-y-6 md:space-y-8">
          {/* 内容提取失败提示 */}
          {extractFailed && <ExtractFailAlert errorMessage={extractError} onSwitchToManual={handleSwitchToManual} />}

          {/* 输入区域 */}
          <section
            className="relative rounded-2xl shadow-lg p-4 md:p-6 transition-all duration-500"
            style={{ backgroundColor: COLORS.bgCard, border: '1px solid rgba(51, 65, 85, 0.5)' }}
          >
            {loading && <LoadingOverlay status={loadingStatus} />}

            {inputMode === 'url' ? (
              <UrlInputMode text={text} onChange={setText} loading={loading} />
            ) : (
              <TextInputMode text={text} onChange={setText} loading={loading} onBackToUrl={handleBackToUrl} />
            )}

            {/* 检测按钮 */}
            <div className="flex justify-end mt-6">
              <button
                onClick={handleAnalyze}
                disabled={isEmpty(text) || loading}
                className="px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-white flex items-center gap-2"
                style={{
                  backgroundColor: COLORS.primary,
                  backgroundImage: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    检测中...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    {TEXTS.BUTTON_START}
                  </>
                )}
              </button>
            </div>
          </section>

          {/* 错误提示 */}
          {error && !extractFailed && (
            <div
              className="rounded-xl px-6 py-4 bubble-pop"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <p style={{ color: '#F87171' }}>{error}</p>
            </div>
          )}

          {/* 结果展示 */}
          {result && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* 操作按钮 */}
              <div className="flex justify-end gap-3 mb-6">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ backgroundColor: COLORS.bgCard, color: COLORS.textTertiary, border: '1px solid #334155' }}
                >
                  {TEXTS.BUTTON_RESET}
                </button>
                <button
                  onClick={() => downloadPoster()}
                  disabled={isDownloading}
                  className="px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center gap-2"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {TEXTS.BUTTON_DOWNLOAD}
                    </>
                  )}
                </button>
              </div>

              {/* 双栏仪表盘布局 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左侧栏：固定核心数据区 */}
                <ResultDashboard result={result} />

                {/* 右侧栏：独立滚动原文区 */}
                <div className="lg:col-span-2">
                  <div
                    className="rounded-2xl h-[85vh] flex flex-col"
                    style={{ backgroundColor: COLORS.bgCard, border: '1px solid rgba(59, 130, 246, 0.2)' }}
                  >
                    {/* 标题栏 - 固定在顶部 */}
                    <div className="p-5 border-b" style={{ borderColor: 'rgba(59, 130, 246, 0.1)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                          >
                            🔍
                          </div>
                          <div>
                            <h2 className="text-base font-bold" style={{ color: COLORS.textPrimary }}>
                              原文探照灯
                            </h2>
                            <p className="text-xs mt-0.5" style={{ color: COLORS.textTertiary }}>
                              点击段落查看 GLM-4 判定逻辑 · 共 {result.sentences?.length || 0} 个句子
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 可滚动内容区 */}
                    <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
                      <TextInspector sentences={result.sentences} onFocusChange={setFocusedSentenceIndex} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 探照灯空状态 */}
          {!result && !loading && isEmpty(text) && <InspectorEmptyState />}
        </main>

        {/* 判定逻辑气泡框 */}
        {focusedSentenceIndex !== null && result?.sentences && (
          <LogicBubble
            sentence={result.sentences[focusedSentenceIndex]}
            sentenceIndex={focusedSentenceIndex}
            detailedSegments={result.detailed_segments}
            onClose={() => setFocusedSentenceIndex(null)}
          />
        )}

        {/* 隐藏的海报容器 */}
        {result && (
          <div className="fixed -left-[9999px] top-0">
            <AnalysisPoster result={result} date={new Date()} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
