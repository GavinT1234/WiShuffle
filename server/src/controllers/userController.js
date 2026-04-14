import { updateUser, findUserById } from '../repositories/userRepo.js';

export async function updateProfileHandler(req, res) {
    const userId = req.user.id;
    const { username, description, avatarUrl, topSongs } = req.body;

    try {
        const updatedUser = await updateUser(userId, {
            username,
            description,
            avatarUrl,
            topSongs: topSongs ? JSON.stringify(topSongs) : undefined,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'Username is already taken' });
        }
        res.status(500).json({ message: 'Failed to update profile' });
    }
}

export async function getUserProfileHandler(req, res) {
    try {
        const { userId } = req.params;

        const user = await findUserById(parseInt(userId));

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
}