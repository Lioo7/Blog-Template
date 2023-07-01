const express = require('express')
const bodyParser = require('body-parser')
// eslint-disable-next-line no-unused-vars
const ejs = require('ejs')
// const _ = require('lodash')
const mongoose = require('mongoose')

async function main () {
  await mongoose.connect('mongodb://127.0.0.1:27017/blogDB')

  const postSchema = new mongoose.Schema({
    title: String,
    content: String
  })

  const Post = mongoose.model('Post', postSchema)

  const homeStartingContnet = 'homeStartingContnet...'
  const aboutContent = 'aboutContent...'
  const contactContenet = 'contactContenet...'

  const app = express()

  app.set('view engine', 'ejs')
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(express.static('public'))

  app.get('/', (req, res) => {
    Post.find({}).then((foundPosts) => {
      console.log('Posts were loaded Successfully')
      console.log(foundPosts)
      res.render('home', {
        startingContnet: homeStartingContnet,
        posts: foundPosts
      })
    }).catch((err) => {
      console.error(err)
    })
  })

  app.get('/about', (req, res) => {
    res.render('about', { aboutContent })
  })

  app.get('/contact', (req, res) => {
    res.render('contact', { contactContenet })
  })

  app.get('/compose', (req, res) => {
    res.render('compose')
  })

  app.post('/compose', (req, res) => {
    const post = new Post({
      title: req.body.composeInputTitle,
      content: req.body.composeInputPostBody
    })
    post.save().then(() => {
      console.log('Post saved successfully')
      res.redirect('/')
    }).catch((err) => {
      console.error(err)
    })
  })

  app.get('/posts/:postId', (req, res) => {
    const { postId } = req.params
    console.log('postId:', postId)

    Post.findOne({ _id: postId })
      .then((post) => {
        if (!post) {
          console.log('Post not found')
          res.status(404).send('Post not found')
          return
        }

        console.log('Post found')
        res.render('post', {
          postTitle: post.title,
          postContent: post.content
        })
      })
      .catch((err) => {
        console.log(`Error occurred while finding the post:\n${err.message}`)
        res.status(500).send('Error occurred while finding the post')
      })
  })

  app.listen(3000, () => {
    console.log('Server started on port 3000\nhttp://localhost:3000/')
  })
}

main().catch((err) => console.log(err))
