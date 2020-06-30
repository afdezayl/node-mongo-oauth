import { Router, request } from 'express';
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

storiesRouter.get('/:id', async (req, res) => {
  const loggedUser = req.user?.db_user;

  try {
    const story = await Story.findOne({
      _id: req.params.id,
      $or: [{ status: 'public' }, { user: req.user?.db_user._id }],
    })
      .populate('user')
      .lean();

    if (story) {
      const isUserStory = story.user._id.equals(loggedUser?._id);
      return res.render('stories/show', { story, isUserStory });
    }
    return res.render('error/404');
  } catch (error) {
    console.log(error);
    return res.render('error/500');
  }
});

storiesRouter.put('/:id', async (req, res) => {
  const storyId = req.params.id;
  const dbUser = req.user?.db_user;
  const updatedStory = req.body;
  try {
    const result = await Story.updateOne(
      { _id: storyId, user: dbUser?._id },
      updatedStory
    );
    res.redirect(`/stories/${storyId}`);
  } catch (err) {
    res.render('error/500');
  }
});

storiesRouter.delete('/:id', async (req, res) => {
  const dbUser = req.user?.db_user;
  try {
    await Story.remove({ _id: req.params.id, user: dbUser?._id });
    res.redirect('/dashboard');
  } catch (err) {
    res.render('error/500');
  }
});

storiesRouter.get('/edit/:id', async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
    user: req.user?.db_user._id,
  }).lean();

  if (story) {
    return res.render('stories/edit', { story });
  }
  return res.redirect('/stories');
});

storiesRouter.get('/user/:userId', async (req, res) => {
  try {
    const loggedUser = req?.user?.db_user;
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();
    res.render('stories/index', { stories, loggedUser });
  } catch (err) {
    res.render('error/500');
  }
});
