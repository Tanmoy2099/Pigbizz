export type sentUser = {
    id?: number,
    name: string,
    isAdmin: boolean,
    email?: string,
    phone?: string,
    passwordModified?: false,
    iat?: number
    exp?: number
}

export type jwtUser = {
    id: number,
    name: string,
    isAdmin: boolean,
    email: string,
    phone: string,
    iat: number,
    exp: number
}