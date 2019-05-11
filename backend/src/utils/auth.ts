import { RefreshTokenEntity } from '@app/entities/RefreshTokenEntity'
import { randomFillSync } from 'crypto'
import { sign, verify } from 'jsonwebtoken'
import { getRepository, MoreThan } from 'typeorm'

function generateRandomString(length: number) {
  const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const array = randomFillSync(new Uint8Array(length))
  return String.fromCharCode(...array.map(x => validChars.charCodeAt(x % validChars.length)))
}

export async function issueRefreshToken(payload: JwtPayload) {
  const tokenRepo = getRepository(RefreshTokenEntity)

  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 14)

  const refreshToken = await tokenRepo.create({
    token: generateRandomString(256),
    userId: payload.userId,
    expirationDate
  })

  const { token } = await tokenRepo.save(refreshToken)

  return token
}

export async function issueAccessToken(payload: JwtPayload) {
  if (!process.env.JWT_SECRET) {
    throw new Error('No jwt secret, please check env variables')
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

  return token && issueAccessToken({ userId: token.userId })
}
