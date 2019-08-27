const express = require('express');
const checkAuth = require('../middleware/check-auth');
const postControllers = require('../controllers/posts');
const extractFiles = require('../middleware/file');
const router = express.Router();

router.post('/api/posts',checkAuth, extractFiles, postControllers.createPost);

router.put('/api/posts/:id',checkAuth, extractFiles, postControllers.updatePost)

router.get('/api/posts', postControllers.getPosts);
router.get('/api/posts/:id', postControllers.getPost);

router.delete('/api/posts/:id',checkAuth, postControllers.deletePost);




module.exports = router;
