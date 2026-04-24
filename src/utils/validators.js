/**
 * URL 验证工具
 */
export const urlPattern = /^https?:\/\/.+/i;

/**
 * 检查是否为有效 URL
 * @param {string} text - 待检查的文本
 * @returns {boolean}
 */
export function isUrl(text) {
  return urlPattern.test(text);
}

/**
 * 验证 URL 抓取的内容
 * @param {string} content - 抓取的内容
 * @returns {Object} { valid: boolean, error?: string }
 */
export function validateExtractedContent(content) {
  const hasCaptcha = /CAPTCHA/i.test(content);
  const hasWarning = /Warning/i.test(content);
  const isTooShort = content.trim().length < 200;

  if (hasCaptcha) {
    return {
      valid: false,
      error: '网站启用了人机验证（CAPTCHA），无法自动抓取。',
    };
  }

  if (hasWarning) {
    return {
      valid: false,
      error: '网站返回了警告信息，可能存在访问限制。',
    };
  }

  if (isTooShort) {
    return {
      valid: false,
      error: '提取的内容过少（少于200字），无法进行有效分析。',
    };
  }

  return { valid: true };
}

/**
 * 检查文本是否为空
 * @param {string} text - 待检查的文本
 * @returns {boolean}
 */
export function isEmpty(text) {
  return !text || !text.trim();
}
