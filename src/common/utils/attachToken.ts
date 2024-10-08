import { AUTHORIZATION_HEADER } from 'common/constant'
import { Response } from 'express'

export function attachToken(response: Response, token: string) {
  response.setHeader(AUTHORIZATION_HEADER, token)
  response.cookie(AUTHORIZATION_HEADER, token, {
    httpOnly: true,
    secure: true,
    domain: process.env.APP_DOMAIN,
    sameSite: 'none',
    maxAge: 15 * 24 * 60 * 60 * 1000
  })

  return
}
