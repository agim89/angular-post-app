const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const config = require('./config')
const path = require('path');
const app = express();

// connecting with mongo atlas server
  mongoose.connect(`mongodb+srv://max:${config.MONGO_ATLAS_PW}@cluster0-cseum.mongodb.net/node-angular?retryWrites=true&w=majority`).then(() => {
  console.log('Conected Successfully to database!')
}).catch(() => {
  console.log('Conection failed to database!')
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PATCH, PUT, DELETE, OPTIONS');
  next();
});
  // tuka mozeme poveke ruti da imame  na primer
// app.use('/api/posts', postRoutes)      ili nekoj drug file to access
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend_node/images")));
app.use(postRoutes);
app.use(userRoutes);




module.exports = app;
