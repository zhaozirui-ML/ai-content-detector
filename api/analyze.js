const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

function getSystemPrompt() {
  return `你是 AI 内容检测专家。你现在收到的是一篇文章的 Markdown 格式文本内容（不是 URL）。请从以下四个维度深度分析文本的 AI 生成特征：

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

**5. 分段详细分析（重要！）**
- 请对文本进行句子级别的分段分析
- 识别出哪些具体句子具有明显的 AI 特征
- 对每个问题句子，给出具体的判定理由
- 最多标注 10 个最具代表性的问题句子

请严格返回 JSON 格式（不要有其他文字）：
{
  "ai_score": 0-100 的数值,
  "structural_overuse": "低/中/高",
  "cliche_phrases": ["检测到的万能废话"],
  "emotional_depth": "缺失/较弱/丰富",
  "format_pattern": "AI型列表/人类散文/混合",
  "analysis": "50字以内的总体分析",
  "human_touch_examples": ["发现的人类特征（如有）"],
  "ai_signals": ["发现的所有AI特征"],
  "detailed_segments": [
    {
      "sentence_index": 0,
      "text_snippet": "原文的前30个字符...",
      "specific_reason": "该句子具有明显的AI生成特征，因为..."
    }
  ]
}

注意：
- sentence_index 是句子在原文中的索引（从0开始）
- text_snippet 是该句子的前30个字符，用于定位
- specific_reason 详细说明为什么该句子被判定为AI生成
- 只标注有明显AI特征的句子，不需要标注所有句子`;
}

function parseAIResponse(content) {
  try {
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
    const parsed = JSON.parse(jsonStr);

    if (!parsed.detailed_segments) {
      parsed.detailed_segments = [];
    }

    return parsed;
  } catch (parseError) {
    console.error('JSON 解析失败:', parseError);

    return {
      ai_score: 50,
      structural_overuse: '中',
      cliche_phrases: [],
      emotional_depth: '较弱',
      format_pattern: '混合',
      analysis: content,
      human_touch_examples: [],
      ai_signals: [],
      detailed_segments: [],
    };
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: '只支持 POST 请求' });
  }

  const apiKey = process.env.ZHIPU_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: '服务端未配置 ZHIPU_API_KEY' });
  }

  const content = typeof request.body?.content === 'string' ? request.body.content.trim() : '';
  if (!content) {
    return response.status(400).json({ error: '缺少需要分析的文章内容' });
  }

  try {
    const glmResponse = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(),
          },
          {
            role: 'user',
            content,
          },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const data = await glmResponse.json();

    if (!glmResponse.ok) {
      return response.status(glmResponse.status).json({
        error: data?.error?.message || '智谱 API 请求失败',
      });
    }

    const apiContent = data?.choices?.[0]?.message?.content;
    if (!apiContent) {
      return response.status(502).json({ error: '智谱 API 返回内容为空' });
    }

    return response.status(200).json(parseAIResponse(apiContent));
  } catch (error) {
    console.error('AI 分析代理请求失败:', error);
    return response.status(500).json({ error: 'AI 分析服务暂时不可用，请稍后重试' });
  }
}
