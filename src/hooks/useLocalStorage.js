import { useState, useEffect } from 'react'

const useLocalStorage = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    // Get initial value from localStorage or use default
    const storedValue = localStorage.getItem(key)
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue
  })

  useEffect(() => {
    // Update localStorage whenever state changes
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]
}

export default useLocalStorage
