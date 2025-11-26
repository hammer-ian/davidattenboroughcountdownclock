import { useState, useEffect } from 'react'
import './App.css'
import VisitorCounter from './components/VisitorCounter'
import BirthdayWishes from './components/BirthdayWishes'

function App() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [shuffledImages, setShuffledImages] = useState([])
  const [fadingIndices, setFadingIndices] = useState([])
  const [isCelebrating, setIsCelebrating] = useState(false)

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

  // Swap two images at specific indices
  function swapTwoImages(array, index1, index2) {
    const newArray = [...array]
      // Swap the two images at the specified indices
      ;[newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]]
    return newArray
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
      if (shuffledImages.length === 0) return

      // Pick two random different indices
      const index1 = Math.floor(Math.random() * shuffledImages.length)
      let index2 = Math.floor(Math.random() * shuffledImages.length)

      // Ensure they're different
      while (index2 === index1) {
        index2 = Math.floor(Math.random() * shuffledImages.length)
      }

      const indices = [index1, index2]

      // Fade out the two selected images
      setFadingIndices(indices)

      // Wait for fade out, then swap those exact images and fade in
      setTimeout(() => {
        const newArray = swapTwoImages(shuffledImages, index1, index2)
        setShuffledImages(newArray)
        setFadingIndices([])
      }, 800)
    }, 5000)

    return () => clearInterval(rotateTimer)
  }, [shuffledImages])

  const triggerCelebration = () => {
    setIsCelebrating(true)
    // Auto-reset after 10 seconds
    setTimeout(() => {
      setIsCelebrating(false)
    }, 10000)
  }

  const displayTime = isCelebrating
    ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
    : timeLeft

  const scrollToWishes = () => {
    const wishesSection = document.querySelector('.birthday-wishes');
    if (wishesSection) {
      wishesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-banner">
          <h1>David Attenborough 100th Birthday Countdown Clock</h1>
          <VisitorCounter />
        </div>
        <div className="scroll-indicator" onClick={scrollToWishes}>
          <span className="scroll-indicator-text">✨ Share a Birthday Wish</span>
        </div>
      </div>
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

          {isCelebrating && (
            <div className="celebration-message">
              <h2>🎉 Happy 100th Birthday Sir David! 🎉</h2>
              <p>Thank you for a century of wonder and inspiration!</p>
            </div>
          )}
          <div className="countdown">
            <div className="time-unit">
              <span className="number">{displayTime.days}</span>
              <span className="label">Days</span>
            </div>
            <div className="time-unit">
              <span className="number">{displayTime.hours}</span>
              <span className="label">Hours</span>
            </div>
            <div className="time-unit">
              <span className="number">{displayTime.minutes}</span>
              <span className="label">Minutes</span>
            </div>
            <div className="time-unit">
              <span className="number">{displayTime.seconds}</span>
              <span className="label">Seconds</span>
            </div>
          </div>
          <p className="date">May 8, 2026</p>
          {!isCelebrating && (
            <button className="celebrate-button" onClick={triggerCelebration}>
              🎂 Celebrate Now!
            </button>
          )}
        </div>
      </div>
      <BirthdayWishes />
      <footer className="footer">
        By Keira Hamilton
      </footer>
    </>
  )
}

export default App
