if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());

// mongoose.connect('mongodb://localhost:27017/mini_wp', {
mongoose.connect('mongodb+srv://admin:admin@master-cluster-nwspo.mongodb.net/mini-wp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json());

const user = require('./routes/user');
app.use('/user', user);
const post = require('./routes/post');
app.use('/post', post);

const errorHandler = require('./middleware/errorHandler');

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server >>>>>> 3000!`)
});