/**
 * 计算突发性 (Burstiness) 的函数：B = σ / μ
 * 用于分析文本句长的变化幅度
 *
 * @param {string} text - 待分析的文本
 * @returns {Object} 包含突发性值、句长数组和句子的对象
 */
export function calculateBurstiness(text) {
  if (!text || text.trim().length === 0) {
    return { burstiness: 0, sentenceLengths: [], sentences: [] };
  }

  // 按中英文标点符号分割句子
  const sentences = text
    .split(/[。！？.!?]/)
    .filter((s) => s.trim().length > 0);

  // 少于2个句子无法计算
  if (sentences.length < 2) {
    return { burstiness: 0, sentenceLengths: [], sentences };
  }

  // 计算每个句子的长度
  const sentenceLengths = sentences.map((s) => s.trim().length);

  // 计算平均值 (μ)
  const mean = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;

  // 平均值为0时无法计算
  if (mean === 0) {
    return { burstiness: 0, sentenceLengths, sentences };
  }

  // 计算方差
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / sentenceLengths.length;

  // 计算标准差 (σ)
  const stdDev = Math.sqrt(variance);

  // 计算突发性 B = σ / μ
  const burstiness = stdDev / mean;

  return {
    burstiness: Math.min(1, Math.max(0, burstiness / 2)), // 归一化到 0-1
    sentenceLengths,
    sentences,
  };
}
