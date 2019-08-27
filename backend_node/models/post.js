const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
  id: Schema.Types.ObjectId,
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Post', postSchema);
