import { useState, useEffect } from "react"

export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Initial check
    checkIfMobile()
    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return (): void => window.removeEventListener("resize", checkIfMobile)
  }, [breakpoint])

  return isMobile
}
