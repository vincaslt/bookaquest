import * as React from 'react'

function useLoading(initial = false) {
  const [isLoading, setIsLoading] = React.useState(initial)

  const withLoading = <T>(promise: Promise<T>) => promise.finally(() => setIsLoading(false))

  return { isLoading, withLoading }
}

export default useLoading
