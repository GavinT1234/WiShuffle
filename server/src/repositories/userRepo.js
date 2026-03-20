import prisma from '../config/db.js';

export async function createUser(data) {
    try {
        const newUser = await prisma.user.create({ data, omit: { password: true } });
        return newUser;
    } catch (error) {
        if (error.code === 'P2002') {
            const err = new Error('Email has already been used');
            err.status = 409;
            throw err;
        }
        throw error;
    }
}

export async function findUserByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
}

export async function findUserByUsername(username) {
    return prisma.user.findUnique({ where: { username } });
}

export async function findAllUsers() {
    return prisma.user.findMany({ omit: { password: true } });
}

export async function findUserById(id) {
    return prisma.user.findUnique({ where: { id }, omit: { password: true } });
}

export async function findManyUsersByIds(ids) {
    return prisma.user.findMany({ where: { id: { in: ids.map(Number) } } });
}

export async function updateUser(id, updatedData) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updatedData,
            omit: { password: true }
        });
        return updatedUser;
    } catch (error) {
        if (error.code === 'P2025') return null;
        throw error;
    }
}