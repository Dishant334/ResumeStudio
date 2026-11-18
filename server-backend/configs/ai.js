import OpenAI from 'openai'

// Works with any OpenAI-compatible endpoint (Gemini, OpenAI, OpenRouter, ...)
let client = null
export const aiConfigured = () => Boolean(process.env.OPENAI_API_KEY)

export const aiComplete = async (prompt) => {
  if (!aiConfigured()) {
    const err = new Error('AI is not configured. Set OPENAI_API_KEY in server-backend/.env')
    err.status = 503
    throw err
  }
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    })
  }
  try {
    const res = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gemini-2.5-flash',
      messages: [{ role: 'user', content: prompt }],
    })
    return (res.choices?.[0]?.message?.content || '').trim()
  } catch (e) {
    const err = new Error(
      e.status === 401 || e.status === 403
        ? 'AI key was rejected by the provider. Create a new key and update OPENAI_API_KEY.'
        : e.status === 429
        ? 'AI rate limit reached. Please try again in a moment.'
        : 'AI request failed: ' + (e.message || 'unknown error')
    )
    err.status = 502
    throw err
  }
}
