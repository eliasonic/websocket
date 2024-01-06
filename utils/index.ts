export const COOKIE_SECRET = 'secret'
export const AT_KEY = 'at'

export function verifyToken(tk: string) {
    return tk === 'test'
}
