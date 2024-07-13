import { Router } from 'express';

import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// @ts-ignore
router.get('/', async (req, res) => {
  try {
    const profile = await prisma.profile.findFirst();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/', async (req, res) => {
  try {
    const data: ProfileData = req.body;
    // @ts-ignore
    const updatedProfile: Profile | null = await prisma.profile.update({
      // @ts-ignore
      where: { id: data.id },
      data: {
        username: data.username,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar,
        language: data.language,
        theme: data.theme,
      },
    });
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

interface ProfileData {
  id: number;
  did: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  language: string;
  theme: string;
}

interface Profile {
  id: number;
  did: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  language: string;
  theme: string;
}

export default router;
