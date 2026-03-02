module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { cards } = req.body;
    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'Invalid request: cards array required' });
    }

    const enhanced = [];
    for (const card of cards) {
      if (!card.title || !card.content) {
        enhanced.push(card);
        continue;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'あなたは手相鑑定の専門家です。渡された鑑定文を、より自然で読みやすく、その人を深く理解した印象を与えるように改善してください。内容の意味や解釈は変えず、表現だけを洗練させてください。改行はそのまま活かしてください。'
            },
            {
              role: 'user',
              content: `【${card.title}】\n\n${card.content}`
            }
          ],
          temperature: 0.5,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenAI API error: ${response.status} ${err}`);
      }

      const data = await response.json();
      const enhancedContent = data.choices?.[0]?.message?.content?.trim() || card.content;

      enhanced.push({
        ...card,
        content: enhancedContent
      });
    }

    return res.status(200).json({ cards: enhanced });
  } catch (error) {
    console.error('Enhance error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to enhance content'
    });
  }
}
