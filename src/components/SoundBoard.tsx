'use client'

import React, { useContext, createContext } from 'react'

// Create a context for expression updates
export const ExpressionContext = createContext<(expression: string) => void>(() => {});

interface SoundButtonProps {
  sound: string
  mood: string
  imageName: string
  alt: string
  onPlay: (sound: string, mood: string, imageName: string) => void
}

const SoundButton: React.FC<SoundButtonProps> = ({ sound, mood, imageName, alt, onPlay }) => (
  <div 
    onClick={() => onPlay(sound, mood, imageName)} 
    className="cursor-pointer m-2 transition-transform hover:scale-110"
  >
    <img 
      src={`/nina-faces/${imageName}.png`} 
      alt={alt} 
      className="w-16 h-16 rounded-full shadow-md" 
    />
  </div>
)

const SoundBoard: React.FC = () => {
  // We'll need a way to access the setExpression function from CameraStream
  // This will be set up in the parent component
  const setExpression = useContext(ExpressionContext);

  const playSound = (sound: string, mood: string, imageName: string) => {
    // Play the audio
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.play().catch(error => {
      console.error("Error playing sound:", error);
    });
    
    // Update the expression/filter
    setExpression(imageName);
  }

  return (
    <div className="sound-buttons grid grid-cols-3 gap-4 justify-items-center mt-4">
      <SoundButton
        sound="cheeseplate"
        mood="angry"
        imageName="angry0"
        alt="Angry face"
        onPlay={playSound}
      />
      <SoundButton
        sound="melons"
        mood="angry"
        imageName="angry1"
        alt="Angry face in sailor hat"
        onPlay={playSound}
      />
      <SoundButton
        sound="testify"
        mood="happy"
        imageName="happy0"
        alt="Happy face with grey wig"
        onPlay={playSound}
      />
      <SoundButton
        sound="kmart"
        mood="disgusted"
        imageName="disgusted0"
        alt="Disgusted face"
        onPlay={playSound}
      />
      <SoundButton
        sound="gowest"
        mood="neutral"
        imageName="neutral0"
        alt="Neutral face"
        onPlay={playSound}
      />
      <SoundButton
        sound="elevengendary"
        mood="happy"
        imageName="happy2"
        alt="Happy face with entrance look"
        onPlay={playSound}
      />
      <SoundButton
        sound="seemymom"
        mood="sad"
        imageName="sad0"
        alt="Sad face"
        onPlay={playSound}
      />
      <SoundButton
        sound="gloryholes"
        mood="surprised"
        imageName="surprised1"
        alt="Surprised face"
        onPlay={playSound}
      />
      <SoundButton
        sound="tryingmary"
        mood="surprised"
        imageName="surprised0"
        alt="Shocked face"
        onPlay={playSound}
      />
    </div>
  )
}

export default SoundBoard