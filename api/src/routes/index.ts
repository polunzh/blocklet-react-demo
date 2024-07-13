import middleware from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';

import profileRouter from './profile';
import uploadRouter from './upload';

const router = Router();

router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));

router.use('/data', (_, res) =>
  res.json({
    message: 'Hello Blocklet!',
  }),
);

router.use('/api/profile', profileRouter);
router.use('/api/upload', uploadRouter);

export default router;
