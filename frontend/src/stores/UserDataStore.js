import { ref, reactive } from 'vue'

// Create a reactive store that can be imported across components
const userData = reactive({
  gender: null,
  age: 25,
  height: 170,
  weight: 70,
  activity_level: null,
  goal: 'maintenance',
  location: '',
})

// Flag to track if data is being loaded from backend
const isLoading = ref(false)

// Clear cache on app start
const clearCacheOnStartup = async () => {
  try {
    // console.log('Clearing cache on startup')
    await fetch('http://localhost:8000/api/clear-cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
      cache: 'no-store',
    })
    // console.log('Cache cleared on startup')
  } catch (error) {
    console.error('Error clearing cache on startup:', error)
  }
}

// Call this function immediately
clearCacheOnStartup()

// Export functions to interact with the store
export function useUserDataStore() {
  // Manual clear function for testing
  const clearUserData = async () => {
    try {
      console.log('Manually clearing data and cache')
      isLoading.value = true

      // Reset local data first
      Object.assign(userData, {
        gender: null,
        age: 25,
        height: 170,
        weight: 70,
        activity_level: null,
        goal: 'maintenance',
        location: '',
      })

      // Then clear backend cache
      const response = await fetch('http://localhost:8000/api/clear-cache', {
        method: 'POST',
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to clear cache')
      }

      console.log('Cache cleared successfully')
      return true
    } catch (error) {
      console.error('Error clearing data:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Save all current data to backend
  const saveToBackend = async () => {
    try {
      // console.log('Sending user data:', JSON.stringify(userData))

      isLoading.value = true
      const response = await fetch('http://localhost:8000/api/user-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      // Log response for debugging
      // const responseText = await response.text()
      // console.log('Response:', response.status, responseText)

      if (!response.ok) {
        throw new Error(`Failed to save user data: ${responseText}`)
      }

      // return JSON.parse(responseText)
      return await response.json()
    } catch (error) {
      console.error('Error saving user data:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Load all data from backend
  const loadFromBackend = async () => {
    try {
      isLoading.value = true
      const timestamp = new Date().getTime()

      const response = await fetch(`http://localhost:8000/api/user-data?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()

      // Update store with retrieved data
      Object.assign(userData, data)
      return data
    } catch (error) {
      console.error('Error loading user data:', error)
      return {}
    } finally {
      isLoading.value = false
    }
  }
  // const loadFromBackend = async () => {
  //   try {
  //     isLoading.value = true
  //     const response = await fetch('http://localhost:8000/api/user-data')

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch user data')
  //     }

  //     const data = await response.json()

  //     // Update store with retrieved data
  //     Object.assign(userData, data)
  //     return data
  //   } catch (error) {
  //     console.error('Error loading user data:', error)
  //     // Don't throw error here to prevent app from breaking if backend is unavailable
  //     return {}
  //   } finally {
  //     isLoading.value = false
  //   }
  // }

  // Update specific field in user data
  const updateUserData = (field, value) => {
    userData[field] = value
  }

  // Utility to check if all required data is present
  const hasRequiredData = () => {
    return (
      userData.gender &&
      userData.age &&
      userData.height &&
      userData.weight &&
      userData.activity_level
      // userData.goal &&
      // userData.location
    )
  }

  return {
    userData,
    isLoading,
    saveToBackend,
    loadFromBackend,
    updateUserData,
    hasRequiredData,
  }
}
