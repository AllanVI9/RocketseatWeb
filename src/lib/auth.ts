import { cookies } from 'next/headers'
import decode from 'jwt-decode'

interface User {
  sub: string
  name: string
  avatarUrl: string
}

export function getUser(): User {
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Unauthenticated.')
  }

  const user: User = decode(token)

  return user
}

// export function isAuthenticated(): boolean {
//   const isAuthenticated = cookies().has('token')

//   return isAuthenticated
// }

// export function getToken(): string {
//   const token = cookies().get('token')?.value

//   return token ?? ''
// }