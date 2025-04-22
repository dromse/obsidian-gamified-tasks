import { useState, useEffect } from "react"

export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Initial check
    checkIfMobile()
    console.log("isMobile", isMobile)
    console.log("window.innerWidth", window.innerWidth)
    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [breakpoint])

  return isMobile
}
