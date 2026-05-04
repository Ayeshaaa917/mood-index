'use client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetch_mood = () => {
      fetch('/api/mood')
        .then(r => r.json())
        .then(d => setData(d))
    }
    fetch_mood()
    const interval = setInterval(fetch_mood, 3000)
    return () => clearInterval(interval)
  }, [])

  if (!data) return <p style={{padding:'2rem', fontFamily:'monospace'}}>connecting to stream...</p>

  return (
    <main style={{padding:'2rem', fontFamily:'monospace', maxWidth:'600px', margin:'0 auto'}}>
      <h1 style={{fontSize:'13px', letterSpacing:'0.1em', color:'#888', marginBottom:'2rem'}}>
        FARCASTER MOOD INDEX
      </h1>

      <div style={{fontSize:'72px', fontWeight:'500', lineHeight:1}}>
        {data.score}
      </div>
      <div style={{fontSize:'18px', marginTop:'8px', color: data.score >= 60 ? '#1D9E75' : data.score >= 40 ? '#EF9F27' : '#D85A30'}}>
        {data.label}
      </div>

      <div style={{marginTop:'2rem', fontSize:'13px', color:'#888'}}>
        {data.total} casts analyzed
      </div>

      <div style={{marginTop:'2rem'}}>
        {Object.entries(data.breakdown).map(([k,v]) => (
          <div key={k} style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px'}}>
            <span style={{width:'64px', fontSize:'12px', color:'#888'}}>{k}</span>
            <div style={{flex:1, height:'6px', background:'#f0f0f0', borderRadius:'3px'}}>
              <div style={{width: v + '%', height:'100%', background:'#1D9E75', borderRadius:'3px'}}></div>
            </div>
            <span style={{fontSize:'12px', color:'#888'}}>{v}%</span>
          </div>
        ))}
      </div>

      <div style={{marginTop:'2rem', fontSize:'11px', color:'#aaa'}}>
        updates every 3 seconds
      </div>
    </main>
  )
}
