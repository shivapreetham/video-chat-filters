"use client";

import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

interface CameraStreamProps {
  initialExpression?: string;
  onExpressionChange?: (expression: string) => void;
}

const CameraStream: React.FC<CameraStreamProps> = ({ 
  initialExpression = "neutral0",
  onExpressionChange
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [moodDetectionMode, setMoodDetectionMode] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(initialExpression);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  // Preload face images - use state to track loading
  const [ninaFaces, setNinaFaces] = useState<Record<string, HTMLImageElement>>({});

  // Handle expression changes internally and notify parent
  const updateExpression = (expression: string) => {
    setCurrentExpression(expression);
    if (onExpressionChange) {
      onExpressionChange(expression);
    }
  };

  // Load images on component mount
  useEffect(() => {
    const faceExpressions = [
      "angry0", "angry1",
      "disgusted0",
      "fearful0",
      "happy0", "happy1", "happy2",
      "neutral0",
      "sad0",
      "surprised0", "surprised1"
    ];
    
    const loadedImages: Record<string, HTMLImageElement> = {};
    
    faceExpressions.forEach((expression) => {
      const img = new Image();
      img.src = `/nina-faces/${expression}.png`;
      img.onload = () => {
        loadedImages[expression] = img;
        // Update state if all images are loaded
        if (Object.keys(loadedImages).length === faceExpressions.length) {
          setNinaFaces(loadedImages);
        }
      };
    });
  }, []);

  // Update when initialExpression changes from parent
  useEffect(() => {
    if (initialExpression !== currentExpression) {
      setCurrentExpression(initialExpression);
      // Also disable mood detection mode when expression is explicitly set
      setMoodDetectionMode(false);
    }
  }, [initialExpression]);

  // Load models and setup camera
  useEffect(() => {
    const loadModelsAndSetupCamera = async () => {
      try {
        await Promise.all([
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
          faceapi.nets.tinyFaceDetector.loadFromUri("/models")
        ]);
        console.log("Face-api models loaded successfully");
        setIsModelLoaded(true);
        await setupCamera();
      } catch (err) {
        console.error("Error loading models:", err);
      }
    };

    loadModelsAndSetupCamera();

    // Clean up function to stop detection on unmount
    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  // Start face detection after models and camera are ready
  useEffect(() => {
    if (isModelLoaded && videoRef.current && videoRef.current.readyState === 4) {
      startFaceDetection();
    }
  }, [isModelLoaded, ninaFaces]);

  const setupCamera = async () => {
    try {
      if (!videoRef.current) return;
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      
      videoRef.current.srcObject = stream;
      
      // Wait for video to be ready
      return new Promise<void>((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            console.log("Camera setup complete");
            resolve();
          };
        }
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const startFaceDetection = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }

    // Less frequent updates to reduce blinking (200ms instead of 100ms)
    detectionInterval.current = setInterval(() => {
      detectFace();
    }, 200);
  };

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;
    if (Object.keys(ninaFaces).length === 0) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Ensure video is playing and ready
    if (video.paused || video.ended || video.readyState !== 4) return;

    const displaySize = {
      width: video.offsetWidth,
      height: video.offsetHeight,
    };
    
    // Match dimensions only if they changed (reduces unnecessary redraws)
    if (canvas.width !== displaySize.width || canvas.height !== displaySize.height) {
      faceapi.matchDimensions(canvas, displaySize);
    }

    try {
      const detectionResult = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 128 }))
        .withFaceExpressions();

      if (detectionResult.length === 0) {
        return;
      }

      const detection = detectionResult[0].detection;
      const expressions = detectionResult[0].expressions;

      if (moodDetectionMode) {
        // Find the expression with the highest confidence
        const maxExpression = Object.entries(expressions).reduce(
          (max, [expression, confidence]) => 
            confidence > max.confidence ? { expression, confidence } : max,
          { expression: "neutral", confidence: 0 }
        );
        
        // Only update if confidence is significant
        if (maxExpression.confidence > 0.5) {
          const expressionName = maxExpression.expression.toLowerCase();
          
          // Find a matching image name in our available masks
          const availableExpressions = Object.keys(ninaFaces);
          const matchingImage = availableExpressions.find(name => 
            name.includes(expressionName)
          );
          
          if (matchingImage && matchingImage !== currentExpression) {
            updateExpression(matchingImage);
          }
        }
      }

      const resizedDetections = faceapi.resizeResults([detection], displaySize);
      drawFace(resizedDetections[0], canvas);
    } catch (err) {
      console.error("Error during face detection:", err);
    }
  };

  const drawFace = (detection: faceapi.FaceDetection, canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const box = detection.box;
    // Adjust size and position to better fit the face
    const imgWidth = box.width * 1.8;
    const imgHeight = box.height * 1.8;
    const x = box.x - imgWidth * 0.4;
    const y = box.y - imgHeight * 0.4;
    
    // Find image that matches the current expression
    const expressionImg = ninaFaces[currentExpression];
    
    if (expressionImg) {
      ctx.drawImage(expressionImg, x, y, imgWidth, imgHeight);
    } else {
      // Fallback to neutral if the current expression isn't available
      const fallbackImg = ninaFaces["neutral0"];
      if (fallbackImg) {
        ctx.drawImage(fallbackImg, x, y, imgWidth, imgHeight);
      }
    }
  };

  return (
    <div>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-h-[400px] object-contain rounded-lg shadow-lg"
        />
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
      <div className="flex items-center justify-center mt-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <span>Use mood detection</span>
          <input
            type="checkbox"
            checked={moodDetectionMode}
            onChange={() => setMoodDetectionMode(!moodDetectionMode)}
            className="h-4 w-4"
          />
        </label>
      </div>
    </div>
  );
};

export default CameraStream;