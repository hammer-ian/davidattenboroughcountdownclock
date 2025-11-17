import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [shuffledImages, setShuffledImages] = useState([])
  const [fadingIndices, setFadingIndices] = useState([])

  // All images from the attenborough folder
  const images = [
    'DA bird.avif',
    'DA Butterfly.jpg',
    'DA Cheetah.jpg',
    'DA field.webp',
    'DA Giant Sea Turtle.webp',
    'DA Lion cub.jpg',
    'DA lizard.avif',
    'DA Meercat.jpg',
    'DA Otter.jpg',
    'DA Owls.webp',
    'DA Porcupine.jpg',
    'DA Prehistoric.avif',
    'DA Puffin.webp',
    'DA Safari.webp',
    'DA Bear.jpg',
    'DA.avif',
    'DA Gorilla.jpg'
  ]

  // Swap two random images
  function swapTwoRandomImages(array) {
    const newArray = [...array]
    const length = newArray.length

    // Pick two random different indices
    const index1 = Math.floor(Math.random() * length)
    let index2 = Math.floor(Math.random() * length)

    // Ensure index2 is different from index1
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * length)
    }

    // Swap the two images
    ;[newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]]

    return { newArray, indices: [index1, index2] }
  }

  // Initial shuffle for variety
  function shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Initialize shuffled images on mount
  useEffect(() => {
    setShuffledImages(shuffleArray(images))
  }, [])

  function calculateTimeLeft() {
    const targetDate = new Date('2026-05-08T00:00:00')
    const now = new Date()
    const difference = targetDate - now

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      }
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  // Update countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Swap two random images every 5 seconds with fade transition
  useEffect(() => {
    const rotateTimer = setInterval(() => {
      // Pick two random indices to fade out
      const tempIndices = [
        Math.floor(Math.random() * shuffledImages.length),
        Math.floor(Math.random() * shuffledImages.length)
      ]

      // Ensure they're different
      while (tempIndices[0] === tempIndices[1]) {
        tempIndices[1] = Math.floor(Math.random() * shuffledImages.length)
      }

      // Fade out the two selected images
      setFadingIndices(tempIndices)

      // Wait for fade out, then swap and fade in
      setTimeout(() => {
        const { newArray, indices } = swapTwoRandomImages(shuffledImages)
        setShuffledImages(newArray)
        setFadingIndices([])
      }, 800)
    }, 5000)

    return () => clearInterval(rotateTimer)
  }, [shuffledImages])

  return (
    <div className="image-grid">
      {shuffledImages.map((image, index) => (
        <div
          key={index}
          className={`grid-item ${fadingIndices.includes(index) ? 'fade-out' : 'fade-in'}`}
        >
          <img
            src={`/Images/attenborough/${image}`}
            alt={`David Attenborough ${index + 1}`}
          />
        </div>
      ))}

      <div className="countdown-clock">
        <h1>David Attenborough's 100th Birthday</h1>
        <div className="countdown">
          <div className="time-unit">
            <span className="number">{timeLeft.days}</span>
            <span className="label">Days</span>
          </div>
          <div className="time-unit">
            <span className="number">{timeLeft.hours}</span>
            <span className="label">Hours</span>
          </div>
          <div className="time-unit">
            <span className="number">{timeLeft.minutes}</span>
            <span className="label">Minutes</span>
          </div>
          <div className="time-unit">
            <span className="number">{timeLeft.seconds}</span>
            <span className="label">Seconds</span>
          </div>
        </div>
        <p className="date">May 8, 2026</p>
      </div>
    </div>
  )
}

export default App
