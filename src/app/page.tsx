// app/page.tsx
'use client'

import { useState } from 'react'
import Head from 'next/head'
import CameraStream from '@/components/CameraStream'
import SoundBoard, { ExpressionContext } from '@/components/SoundBoard'

export default function Home() {
  // Create a state to share between components
  const [currentExpression, setCurrentExpression] = useState("neutral0");

  return (
    <>
      
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-6">
          Go big. Be Kind.<br />Go West.
        </h1>
        
        <div id="video-container" className="relative mt-4 max-w-lg mx-auto">
          {/* Provide the expression setter to the CameraStream */}
          <CameraStream initialExpression={currentExpression} onExpressionChange={setCurrentExpression} />
        </div>
        
        {/* Provide the expression setter to the SoundBoard via context */}
        <ExpressionContext.Provider value={setCurrentExpression}>
          <SoundBoard />
        </ExpressionContext.Provider>
      </main>
    </>
  )
}