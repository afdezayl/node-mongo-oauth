import { Router } from 'express';
import { ensureValidSession } from '../auth/utils';
import Story from './models/Story';

export const storiesRouter = Router();

storiesRouter.use(ensureValidSession);

storiesRouter.get('/', async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    
    res.render('stories/index', { stories, loggedUser: req?.user?.db_user });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

storiesRouter.post('/', async (req, res) => {
  try {
    const id = req?.user?._id;
    const newStory = req.body;

    console.log(newStory, req.user, id);
    await Story.create({ ...newStory, user: id });
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

storiesRouter.get('/add', async (req, res) => {
  res.render('stories/add');
});
