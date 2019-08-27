const Post = require('../models/post');


let posts = {
  createPost:  (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    post.save().then(doc => {
      const obj = {
        ...post,
        id: doc._id
      }
      res.status(201).json({message: 'success', post: obj });
    }).catch(error =>{
      res.status(500).json({message: 'Crating post failed!'})
    });
  },

  updatePost: (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne({_id: req.body.id, creator: req.userData.userId}, post).then(response => {
      if (response.n > 0) {
        res.status(200).json(response)
      }else {
        res.status(401).json({message: 'Not Authorised!'})
      }
    }).catch(error =>{
      res.status(500).json({message: 'Updating post failed!'})
    })
  },

  getPosts: (req, res, next) => {
    const page = +req.query.page - 1;
    const size = +req.query.size;
    const skip = page * size;
    let totalItems ;
    let totalPages ;

    Post.find().skip(skip).limit(size).then(doc => {
      Post.count().then(total => {
        totalItems = total;
        totalPages = Math.ceil(total / size);
        res.status(200).json({message: 'success', posts: doc, totalItems: totalItems, totalPages: totalPages })
      });
    }).catch(error => {
      res.status(500).json({message: 'Getting posts failed!'})
    });

  },

  getPost: (req,res, next) => {
    console.log(req.params)
    Post.findById(req.params.id).then(doc => {
      if(doc){
        res.status(200).json(doc)
      }else{
        res.status(404).json({message: 'Post not found!'})
      }
    }).catch(error => {
      res.status(500).json({message: 'Get post failed!'})
    });
  },

  deletePost: (req, res, next) => {
    let id = req.params.id;
    Post.deleteOne({_id: id, creator: req.userData.userId}).then(result => {
      console.log(result)
      if (result.n > 0) {
        res.status(200).json({message: 'Deleted Post'});
      }else {
        res.status(401).json({message: 'Not Authorised!'});
      }
    }).catch(error => {
      console.log('error');
      res.status(500).json({message: 'Deleting post failed!'})
    });
  }
}


module.exports = posts;
