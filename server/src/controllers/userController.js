import { updateUser } from '../repositories/userRepo.js';

export async function updateProfileHandler(req, res) {
    const userId = req.user.id;
    const { username, description, avatarUrl } = req.body;

    try {
        const updatedUser = await updateUser(userId, {
            username,
            description,
            avatarUrl,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
}
