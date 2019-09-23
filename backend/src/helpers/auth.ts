import { RefreshTokenEntity } from '@app/entities/RefreshTokenEntity'
import { JwtPayload } from '@app/lib/interfaces'
import { randomFillSync } from 'crypto'
import { sign, verify } from 'jsonwebtoken'
import { getRepository, MoreThan } from 'typeorm'

function generateRandomString(length: number) {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = randomFillSync(new Uint8Array(length))
  return String.fromCharCode(...array.map(x => validChars.charCodeAt(x % validChars.length)))
}

export async function issueRefreshToken(userId: string) {
  const tokenRepo = getRepository(RefreshTokenEntity)

  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 14) // TODO: Probably not a correct way to add days

  const refreshToken = await tokenRepo.create({
    token: generateRandomString(256),
    userId,
    expirationDate
  })

  const { token } = await tokenRepo.save(refreshToken)

  return token
}

export async function issueAccessToken(userId: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('No jwt secret, please check env variables')
  }

  const expires = new Date()
  expires.setMinutes(expires.getMinutes() + 5) // TODO: Probably not a correct way to add minutes

  const payload: JwtPayload = {
    userId,
    expires
  }

  return sign(payload, process.env.JWT_SECRET)
}

export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('No jwt secret, please check env variables')
  }
  return verify(token, process.env.JWT_SECRET)
}

export async function refreshAccessToken(userId: string, refreshToken: string) {
  const tokenRepo = getRepository(RefreshTokenEntity)

  const token = await tokenRepo.findOne({
    where: {
      userId,
      token: refreshToken,
      expirationDate: MoreThan(new Date())
    }
  })

  return token && issueAccessToken(token.userId)
}
