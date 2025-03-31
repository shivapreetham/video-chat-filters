'use client'
import { useState } from 'react'
import CameraStream from '@/components/CameraStream'
import SoundBoard from '@/components/SoundBoard'

export default function Home() {
  const [currentMask, setCurrentMask] = useState('/nina-faces/neutral0.png') 

  return (
    <>
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center">
          Go big. Be Kind.<br />Go West.
        </h1>
        <div id="video-container" className="relative mt-4 max-w-lg mx-auto">
          <CameraStream mask={currentMask} />
        </div>
        <SoundBoard setMask={setCurrentMask} />
      </main>
    </>
  )
}