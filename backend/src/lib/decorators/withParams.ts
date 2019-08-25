import { RequestHandler } from 'micro'
import { AugmentedRequestHandler } from 'microrouter'

export function withParams<K extends string>(
  keys: K[],
  handler: (keys: { [key in K]: string }) => RequestHandler
): AugmentedRequestHandler {
  return (req, res) => {
    const filteredParams = keys.reduce(
      (params, param) => ({ ...params, [param]: req.params[param] }),
      {} as { [key in K]: string }
    )
    return handler(filteredParams)(req, res)
  }
}

export default withParams
