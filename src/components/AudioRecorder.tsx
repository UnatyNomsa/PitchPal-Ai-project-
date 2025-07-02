import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Play, Pause } from 'lucide-react'

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
  onRecordingStart?: () => void
  onRecordingStop?: () => void
}

export function AudioRecorder({ onRecordingComplete, onRecordingStart, onRecordingStop }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(20).fill(0))

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [])

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }

  const startRecording = async () => {
    try {
      cleanup()
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      })
      
      streamRef.current = stream

      // Set up audio visualization
      audioContextRef.current = new AudioContext()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 64
      source.connect(analyserRef.current)

      // Start visualization
      visualizeAudio()

      // Set up MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      const chunks: Blob[] = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
        onRecordingComplete(audioBlob)
        cleanup()
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      onRecordingStart?.()

      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      onRecordingStop?.()
    }
  }

  const visualizeAudio = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const updateVisualization = () => {
      if (!analyserRef.current || !isRecording) return

      analyserRef.current.getByteFrequencyData(dataArray)
      
      // Convert frequency data to visualization bars
      const newLevels = []
      const step = Math.floor(bufferLength / 20)
      
      for (let i = 0; i < 20; i++) {
        let sum = 0
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j]
        }
        const average = sum / step
        newLevels.push(Math.min(100, (average / 255) * 100))
      }
      
      setAudioLevels(newLevels)
      animationRef.current = requestAnimationFrame(updateVisualization)
    }

    updateVisualization()
  }

  const togglePlayback = () => {
    if (!audioURL) return

    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioURL)
        audioRef.current.onended = () => setIsPlaying(false)
      }
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Record Your Pitch</h2>
        <p className="text-gray-600">Click the microphone to start recording</p>
      </div>

      {/* Audio Visualizer */}
      <div className="audio-visualizer mb-8">
        {audioLevels.map((level, index) => (
          <div
            key={index}
            className="audio-bar"
            style={{ 
              height: `${Math.max(4, level * 0.6)}px`,
              opacity: isRecording ? 1 : 0.3 
            }}
          />
        ))}
      </div>

      {/* Recording Controls */}
      <div className="text-center mb-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Mic className="h-8 w-8" />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-20 h-20 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <Square className="h-8 w-8" />
          </button>
        )}
      </div>

      {/* Recording Timer */}
      {isRecording && (
        <div className="text-center mb-6">
          <div className="text-2xl font-mono text-red-500">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-gray-600">Recording...</div>
        </div>
      )}

      {/* Playback Controls */}
      {audioURL && !isRecording && (
        <div className="text-center">
          <button
            onClick={togglePlayback}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 inline mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 inline mr-2" />
                Play
              </>
            )}
          </button>
          <div className="mt-2 text-sm text-gray-600">
            Preview your recording before analysis
          </div>
        </div>
      )}

      {/* Recording Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Recording Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Find a quiet environment</li>
          <li>• Speak clearly and at normal pace</li>
          <li>• Keep your pitch under 3 minutes</li>
          <li>• Practice your opening and closing</li>
        </ul>
      </div>
    </div>
  )
}