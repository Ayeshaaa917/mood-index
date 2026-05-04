const scores = { positive: 80, neutral: 50, negative: 20 }
const memory = { positive: 0, neutral: 0, negative: 0, total: 0 }

export async function GET() {
  const res = await fetch(
    'https://api.neynar.com/v2/farcaster/feed/trending?limit=50',
    { headers: { 'x-api-key': process.env.NEYNAR_API_KEY } }
  )
  const data = await res.json()
  const casts = data.casts || []

  for (const cast of casts) {
    const text = cast.text?.toLowerCase() || ''
    if (!text) continue
    memory.total++
    if (text.match(/love|great|happy|excited|gm|awesome|bullish|lfg|nice/)) memory.positive++
    else if (text.match(/hate|sad|rug|scam|angry|worried|bearish|rekt|bad/)) memory.negative++
    else memory.neutral++
  }

  const total = memory.positive + memory.negative + memory.neutral || 1
  const score = Math.round(
    (memory.positive * 80 + memory.neutral * 50 + memory.negative * 20) / total
  )

  const label = score >= 65 ? 'optimistic' : score >= 45 ? 'mixed' : 'tense'

  return Response.json({
    score,
    label,
    total: memory.total,
    breakdown: {
      positive: Math.round((memory.positive / total) * 100),
      neutral: Math.round((memory.neutral / total) * 100),
      negative: Math.round((memory.negative / total) * 100)
    }
  })
}
