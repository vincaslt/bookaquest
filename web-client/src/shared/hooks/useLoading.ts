import * as React from 'react'

function useLoading(initial = false): [boolean, <T>(promise: Promise<T>) => Promise<T>] {
  const [isLoading, setIsLoading] = React.useState(initial)

  const withLoading = <T>(promise: Promise<T>) =>
    promise.finally((...rest: any[]) => {
      setIsLoading(false)
      return rest
    })

  return [isLoading, withLoading]
}

export default useLoading
