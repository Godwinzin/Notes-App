import { useState, useEffect } from "react"
import "./Greeting.css"

function getGreeting(hour) {
  if (hour < 12) return "Morning"
  if (hour < 18) return "Afternoon"
  return "Evening"
}

function Greeting({ name }) {
  const [hour, setHour] = useState(() => new Date().getHours())

  useEffect(() => {
    const id = setInterval(() => {
      setHour(new Date().getHours())
    }, 60000)

    return () => clearInterval(id)
  }, [])

  const cleanName = name.trim()

  return (
    <p className="greeting">
      Good {getGreeting(hour)}
      {cleanName ? `, ${cleanName}` : ""}
    </p>
  )
}

export default Greeting