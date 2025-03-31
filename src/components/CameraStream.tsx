'use client'
import { useEffect, useRef, useState } from 'react'

interface CameraStreamProps {
  mask: string
}

const CameraStream: React.FC<CameraStreamProps> = ({ mask }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [maskImg, setMaskImg] = useState<HTMLImageElement | null>(null)

  // Load the mask image when the mask prop changes
  useEffect(() => {
    const img = new Image()
    img.src = mask
    img.onload = () => setMaskImg(img)
  }, [mask])

  // Set up video stream and draw loop
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      if (maskImg) {
        // Draw the mask over the video (full size for simplicity)
        ctx.drawImage(maskImg, 0, 0, canvas.width, canvas.height)
      }
      requestAnimationFrame(draw)
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream
        video.play()
        draw()
      })
      .catch((err) => console.error('Camera access failed:', err))

    // Cleanup on unmount
    return () => {
      if (video.srcObject) {
        const stream = video.srcObject as MediaStream
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [maskImg]) // Redraw when maskImg is ready

  return (
    <>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="640" height="480" className="w-full h-auto" />
    </>
  )
}

export default CameraStream