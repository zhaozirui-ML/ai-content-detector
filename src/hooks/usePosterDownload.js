import { useState } from 'react';
import html2canvas from 'html2canvas';

/**
 * 海报下载 Hook
 * 处理分析报告的海报生成和下载
 *
 * @returns {Object} {
 *   isDownloading, downloadPoster
 * }
 */
export function usePosterDownload() {
  const [isDownloading, setIsDownloading] = useState(false);

  /**
   * 下载海报函数
   * @param {string} posterElementId - 海报 DOM 元素的 ID
   * @param {string} filename - 下载的文件名（可选）
   */
  const downloadPoster = async (posterElementId = 'analysis-poster', filename) => {
    setIsDownloading(true);

    try {
      // 查找海报元素
      const posterElement = document.getElementById(posterElementId);
      if (!posterElement) {
        throw new Error('海报元素未找到');
      }

      // 等待 DOM 更新
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 生成 canvas
      const canvas = await html2canvas(posterElement, {
        scale: 3,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      // 转换为 blob 并下载
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('图片生成失败');
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename || `AI检测结果_${new Date().getTime()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          setIsDownloading(false);
        },
        'image/png'
      );
    } catch (err) {
      console.error('下载失败:', err);
      alert('下载失败，请重试');
      setIsDownloading(false);
    }
  };

  return {
    isDownloading,
    downloadPoster,
  };
}
