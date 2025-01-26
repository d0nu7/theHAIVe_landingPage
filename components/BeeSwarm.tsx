import { useEffect, useRef } from "react"

interface Bee {
  x: number
  y: number
  vx: number
  vy: number
}

interface BeeSwarmProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  mousePosition: { x: number; y: number }
}

const BeeSwarm: React.FC<BeeSwarmProps> = ({ canvasRef, mousePosition }) => {
  const beesRef = useRef<Bee[]>([])
  const frameIdRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const beeCount = 50
    const beeSize = 5
    const maxSpeed = 2
    const separationDistance = 20
    const alignmentDistance = 50
    const cohesionDistance = 100
    const mouseInfluenceDistance = 150

    // Initialize bees only once
    if (beesRef.current.length === 0) {
      beesRef.current = Array.from({ length: beeCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * maxSpeed,
        vy: (Math.random() - 0.5) * maxSpeed,
      }))
    }

    const updateBees = () => {
      const bees = beesRef.current

      bees.forEach((bee) => {
        // Apply boid rules
        const separation = { x: 0, y: 0 }
        const alignment = { x: 0, y: 0 }
        const cohesion = { x: 0, y: 0 }
        let separationCount = 0
        let alignmentCount = 0
        let cohesionCount = 0

        bees.forEach((otherBee) => {
          const dx = otherBee.x - bee.x
          const dy = otherBee.y - bee.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < separationDistance) {
            separation.x -= dx
            separation.y -= dy
            separationCount++
          }

          if (distance < alignmentDistance) {
            alignment.x += otherBee.vx
            alignment.y += otherBee.vy
            alignmentCount++
          }

          if (distance < cohesionDistance) {
            cohesion.x += otherBee.x
            cohesion.y += otherBee.y
            cohesionCount++
          }
        })

        // Apply separation
        if (separationCount > 0) {
          bee.vx += separation.x / separationCount
          bee.vy += separation.y / separationCount
        }

        // Apply alignment
        if (alignmentCount > 0) {
          bee.vx += (alignment.x / alignmentCount - bee.vx) * 0.1
          bee.vy += (alignment.y / alignmentCount - bee.vy) * 0.1
        }

        // Apply cohesion
        if (cohesionCount > 0) {
          cohesion.x /= cohesionCount
          cohesion.y /= cohesionCount
          bee.vx += (cohesion.x - bee.x) * 0.001
          bee.vy += (cohesion.y - bee.y) * 0.001
        }

        // Apply mouse influence
        const dx = mousePosition.x - bee.x
        const dy = mousePosition.y - bee.y
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy)
        if (distanceToMouse < mouseInfluenceDistance) {
          bee.vx += (dx / distanceToMouse) * 0.5
          bee.vy += (dy / distanceToMouse) * 0.5
        }

        // Limit speed
        const speed = Math.sqrt(bee.vx * bee.vx + bee.vy * bee.vy)
        if (speed > maxSpeed) {
          bee.vx = (bee.vx / speed) * maxSpeed
          bee.vy = (bee.vy / speed) * maxSpeed
        }

        // Update position
        bee.x += bee.vx
        bee.y += bee.vy

        // Wrap around screen
        bee.x = (bee.x + canvas.width) % canvas.width
        bee.y = (bee.y + canvas.height) % canvas.height
      })
    }

    const drawBees = () => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      beesRef.current.forEach((bee) => {
        ctx.fillStyle = "#FFC300"
        ctx.beginPath()
        ctx.ellipse(bee.x, bee.y, beeSize, beeSize * 0.7, Math.atan2(bee.vy, bee.vx), 0, 2 * Math.PI)
        ctx.fill()

        ctx.fillStyle = "#000000"
        ctx.beginPath()
        ctx.ellipse(
          bee.x + Math.cos(Math.atan2(bee.vy, bee.vx)) * beeSize * 0.5,
          bee.y + Math.sin(Math.atan2(bee.vy, bee.vx)) * beeSize * 0.5,
          beeSize * 0.3,
          beeSize * 0.2,
          Math.atan2(bee.vy, bee.vx),
          0,
          2 * Math.PI,
        )
        ctx.fill()
      })
    }

    const animate = () => {
      updateBees()
      drawBees()
      frameIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(frameIdRef.current)
    }
  }, [canvasRef, mousePosition])

  return null
}

export default BeeSwarm

