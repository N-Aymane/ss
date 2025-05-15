"use client"

import { useState, useEffect } from "react"

export default function DropCountdown({ date }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = new Date(date) - new Date()

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [date])

  if (timeLeft.isExpired) {
    return <div className="text-2xl font-light tracking-wider text-gold">DROP LIVE NOW</div>
  }

  return (
    <div className="flex gap-6 text-center">
      <div>
        <div className="text-3xl md:text-4xl font-light text-gold-light">{timeLeft.days}</div>
        <div className="text-xs uppercase tracking-widest mt-1 text-offwhite opacity-80">Days</div>
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-light text-gold-light">{timeLeft.hours}</div>
        <div className="text-xs uppercase tracking-widest mt-1 text-offwhite opacity-80">Hours</div>
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-light text-gold-light">{timeLeft.minutes}</div>
        <div className="text-xs uppercase tracking-widest mt-1 text-offwhite opacity-80">Mins</div>
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-light text-gold-light">{timeLeft.seconds}</div>
        <div className="text-xs uppercase tracking-widest mt-1 text-offwhite opacity-80">Secs</div>
      </div>
    </div>
  )
}
