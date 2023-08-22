import { prisma } from "../connectDB";
import crypto from 'crypto';


export async function getUserData(email: string, phone: string) {
    const data = await prisma.user.findMany({ where: { OR: [{ email: email.toLowerCase() }, { phone: phone }] } })
    return data[0];
}


export async function resetToken(email: string, phone: string) {

    const resetToken = crypto.randomBytes(16).toString('hex');

    const passwordResetToken = crypto.createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const passwordResetExpires = Date.now() + 30 * 60 * 1000;

    if (email) {
        await prisma.user.update({
            where: { email },
            data: {

                passwordResetToken: passwordResetToken,
                passwordResetExpires: new Date(passwordResetExpires)
            }
        })
    }
    else if (phone) {
        await prisma.user.update({
            where: { phone },
            data: {
                passwordResetToken: passwordResetToken,
                passwordResetExpires: new Date(passwordResetExpires)
            }
        })
    }

    return resetToken;
}
export async function eraseToken(email: string, phone: string) {

    if (email) {
        await prisma.user.update({
            where: { email: email.toLowerCase() },
            data: {
                passwordResetToken: null,
                passwordResetExpires: null
            }
        })
    }
    else if (phone) {
        await prisma.user.update({
            where: { phone: phone },
            data: {
                passwordResetToken: null,
                passwordResetExpires: null
            }
        })
    }
    return
}

export async function checkIfValidTokenDB(token: string) {
    const user = await prisma.user.findMany({ where: { passwordResetToken: token } });
    if (user.length > 0) {
        return user[0]
    } else {
        return {}
    }
}
export async function updatePassword(pass: string, email: string, phone: string) {
    let user;
    if (email) {
        user = await prisma.user.update({
            where: { email },
            data: {
                passwordModified: true,
                passwordChangedAt: new Date(),
                password: pass,
                passwordResetToken: null,
                passwordResetExpires: null
            }
        });

    } else if (phone) {
        user = await prisma.user.update({
            where: { phone },
            data: {
                passwordModified: true,
                passwordChangedAt: new Date(),
                password: pass,
                passwordResetToken: null,
                passwordResetExpires: null
            }
        });
    }
    return user
}
