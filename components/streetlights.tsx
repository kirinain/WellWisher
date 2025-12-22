"use client"

export function Streetlights() {
  // Generate 8 streetlights at random places
  const streetlights = [
    { left: '12%', top: '20%' },
    { left: '45%', top: '25%' },
    { left: '78%', top: '18%' },
    { left: '25%', top: '55%' },
    { left: '65%', top: '52%' },
    { left: '88%', top: '50%' },
    { left: '35%', top: '80%' },
    { left: '72%', top: '75%' },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {streetlights.map((light, index) => (
        <div key={index} className="absolute" style={{ left: light.left, top: light.top }}>
          {/* Light pole */}
          <div 
            className="absolute w-1 h-24 bg-gradient-to-b from-yellow-200 via-yellow-300 to-transparent opacity-50"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          ></div>
          {/* Glowing light */}
          <div 
            className="absolute w-4 h-4 bg-yellow-300 rounded-full shadow-[0_0_15px_8px_rgba(251,191,36,0.6)] opacity-70"
            style={{ 
              left: '50%', 
              top: '0',
              transform: 'translateX(-50%) translateY(-2px)'
            }}
          ></div>
          {/* Light beam */}
          <div 
            className="absolute w-1 h-16 bg-gradient-to-b from-yellow-200/60 via-yellow-300/40 to-transparent opacity-40"
            style={{ 
              left: '50%', 
              top: '0',
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>
      ))}
    </div>
  )
}

