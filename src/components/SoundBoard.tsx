'use client'
import React from 'react'

interface SoundButtonProps {
  sound: string
  imgSrc: string
  alt: string
  onPlay: (sound: string, imgSrc: string) => void
}

const SoundButton: React.FC<SoundButtonProps> = ({ sound, imgSrc, alt, onPlay }) => (
  <div onClick={() => onPlay(sound, imgSrc)} className="cursor-pointer m-2">
    <img src={imgSrc} alt={alt} className="w-16 h-16" />
  </div>
)

interface SoundBoardProps {
  setMask: (mask: string) => void
}

const SoundBoard: React.FC<SoundBoardProps> = ({ setMask }) => {
  const playSound = (sound: string, imgSrc: string) => {
    const audio = new Audio(`/sounds/${sound}.mp3`)
    audio.play()
    setMask(imgSrc) // Update the mask when the sound plays
  }

  return (
    <div className="sound-buttons grid grid-cols-3 gap-4 justify-items-center mt-4">
      <SoundButton
        sound="cheeseplate"
        imgSrc="/nina-faces/angry0.png"
        alt="Angry face"
        onPlay={playSound}
      />
      <SoundButton
        sound="melons"
        imgSrc="/nina-faces/angry1.png"
        alt="Angry face in sailor hat"
        onPlay={playSound}
      />
      <SoundButton
        sound="testify"
        imgSrc="/nina-faces/happy0.png"
        alt="Happy face with grey wig"
        onPlay={playSound}
      />
      <SoundButton
        sound="kmart"
        imgSrc="/nina-faces/disgusted0.png"
        alt="Disgusted face"
        onPlay={playSound}
      />
      <SoundButton
        sound="gowest"
        imgSrc="/nina-faces/neutral0.png"
        alt="Neutral face"
        onPlay={playSound}
      />
      <SoundButton
        sound="elevengendary"
        imgSrc="/nina-faces/happy2.png"
        alt="Happy face with entrance look"
        onPlay={playSound}
      />
      <SoundButton
        sound="seemymom"
        imgSrc="/nina-faces/sad0.png"
        alt="Sad face"
        onPlay={playSound}
      />
      <SoundButton
        sound="gloryholes"
        imgSrc="/nina-faces/surprised1.png"
        alt="Surprised face"
        onPlay={playSound}
      />
      <SoundButton
        sound="tryingmary"
        imgSrc="/nina-faces/surprised0.png"
        alt="Shocked face"
        onPlay={playSound}
      />
    </div>
  )
}

export default SoundBoard