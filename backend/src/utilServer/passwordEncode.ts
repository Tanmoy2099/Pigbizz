import bcrypt from 'bcrypt';


export async function encode(password: string) {
    const pass = await bcrypt.hash(password, 12);
    return pass
}

export async function compare(password: string, mainPassword: string) {
    const pass = await bcrypt.compare(password, mainPassword);
    return pass
}

