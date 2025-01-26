"use client"

import { useEffect, useRef } from "react"
import BeeSwarm from "../components/BeeSwarm"
import useMousePosition from "../hooks/useMousePosition"

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <main className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <BeeSwarm canvasRef={canvasRef} mousePosition={mousePosition} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
        <h1 className="text-6xl font-bold mb-4 text-yellow-400">TheHAIve</h1>
        <p className="text-2xl text-gray-300">Swarming with Innovation</p>
      </div>
    </main>
  )
}

