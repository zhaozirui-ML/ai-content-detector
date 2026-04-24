import { useState } from 'react';
import { calculateBurstiness } from '../utils/calculateBurstiness';
import { isUrl, validateExtractedContent, isEmpty } from '../utils/validators';
import { TEXTS } from '../utils/constants';

/**
 * 内容分析 Hook
 * 处理 URL 提取、AI 分析的所有逻辑
 *
 * @returns {Object} {
 *   loading, error, result,
 *   analyzeContent, reset, setExtractFailed, inputMode, setInputMode
 * }
 */
export function useContentAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [inputMode, setInputMode] = useState('url'); // 'url' | 'text'
  const [extractFailed, setExtractFailed] = useState(false);
  const [extractError, setExtractError] = useState('');

  /**
   * 主要的分析函数
   * @param {string} text - 用户输入的文本或 URL
   */
  const analyzeContent = async (text) => {
    if (isEmpty(text)) return;

    setLoading(true);
    setLoadingStatus(TEXTS.LOADING_DEFAULT);
    setError(null);
    setExtractFailed(false);

    try {
      // 1. 处理 URL 输入
      let contentToAnalyze = text.trim();
      if (isUrl(contentToAnalyze)) {
        setLoadingStatus(TEXTS.LOADING_EXTRACTION);
        const extractedContent = await extractUrlContent(contentToAnalyze);
        contentToAnalyze = extractedContent;
      }

      // 2. 开始 AI 分析
      setLoadingStatus(TEXTS.LOADING_ANALYSIS);

      // 计算突发性
      const burstinessData = calculateBurstiness(contentToAnalyze);

      // 调用 GLM-4 API
      const analysisResult = await callAnalyzeProxy(contentToAnalyze);

      // 合并结果
      const finalResult = {
        ...analysisResult,
        burstiness: burstinessData.burstiness,
        sentenceLengths: burstinessData.sentenceLengths,
        sentences: burstinessData.sentences,
      };

      setResult(finalResult);
    } catch (err) {
      console.error('检测失败:', err);
      const errorMessage = err.response?.data?.error?.message || err.message || '检测失败，请检查 API Key 配置';
      setError(errorMessage);

      // 检查是否为提取失败
      if (errorMessage.includes('提取') || errorMessage.includes('CAPTCHA') || errorMessage.includes('Warning')) {
        setExtractError(errorMessage);
        setExtractFailed(true);
        setInputMode('text');
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * 从 URL 提取内容
   * @param {string} url - 目标 URL
   * @returns {string} 提取的内容
   */
  const extractUrlContent = async (url) => {
    const jinaUrl = `https://r.jina.ai/${url}`;
    const jinaResponse = await fetch(jinaUrl);

    if (!jinaResponse.ok) {
      throw new Error('无法获取网页内容，请检查链接是否正确');
    }

    const content = await jinaResponse.text();

    // 验证提取的内容
    const validation = validateExtractedContent(content);
    if (!validation.valid) {
      throw new Error(`内容提取失败：${validation.error}`);
    }

    return content;
  };

  /**
   * 调用后端代理接口。API Key 只在服务端读取，前端不会再拿到密钥。
   * @param {string} content - 要分析的内容
   * @returns {Object} 分析结果
   */
  const callAnalyzeProxy = async (content) => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.error || 'AI 分析请求失败');
    }

    return data;
  };

  /**
   * 重置分析状态
   */
  const reset = () => {
    setResult(null);
    setError(null);
    setExtractFailed(false);
    setExtractError('');
  };

  return {
    // 状态
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

    // 方法
    analyzeContent,
    reset,
  };
}
