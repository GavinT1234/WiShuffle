import { updateUser, findUserById, searchUsersByUsername, parseUserTopSongs } from '../repositories/userRepo.js';

export async function updateProfileHandler(req, res) {
    const userId = req.user.id;
    const { username, description, avatarUrl, topSongs } = req.body;

    try {
        const updatedUser = await updateUser(userId, {
            username,
            description,
            avatarUrl,
            topSongs: topSongs ? JSON.stringify(topSongs) : null,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Parse topSongs before returning
        parseUserTopSongs(updatedUser);

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

        // Parse topSongs before returning
        parseUserTopSongs(user);

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user profile' });
    }
}

export async function searchUsersHandler(req, res) {
    try {
        const { username } = req.query;
        const userId = req.user?.id;

        if (!username || username.trim().length === 0) {
            return res.status(400).json({ message: 'Username query is required' });
        }

        const users = await searchUsersByUsername(username.trim(), userId);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search users' });
    }
}