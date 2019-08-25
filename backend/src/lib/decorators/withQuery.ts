import { RequestHandler } from 'micro'
import { AugmentedRequestHandler } from 'microrouter'

export function withQuery<K extends string>(
  keys: K[],
  handler: (keys: { [key in K]: string }) => RequestHandler
): AugmentedRequestHandler {
  return (req, res) => {
    const filteredParams = keys.reduce(
      (params, param) => ({ ...params, [param]: req.query[param] }),
      {} as { [key in K]: string }
    )
    return handler(filteredParams)(req, res)
  }
}

export default withQuery
