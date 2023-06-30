const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

    const postSchema = new mongoose.Schema({
        title: String,
        content: String
    });

    const Post = mongoose.model('Post', postSchema);

    const homeStartingContnet = "homeStartingContnet...";
    const aboutContent = "aboutContent...";
    const contactContenet = "contactContenet...";

    const app = express();

    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));

    app.get('/', function(req, res) {
        Post.find({}).then(function(foundPosts) {
            console.log("Posts were loaded Successfully");
            console.log(foundPosts);
            res.render('home', {
                startingContnet: homeStartingContnet, 
                posts: foundPosts
            });
        }).catch(function(err) {
            console.error(err);
        });
    });

    app.get('/about', function(req, res){
        res.render('about', {aboutContent: aboutContent});
    });

    app.get('/contact', function(req, res){
        res.render('contact', {contactContenet: contactContenet});
    });

    app.get('/compose', function(req, res){
        res.render('compose');
    });

    app.post('/compose', function(req, res){
        const post = new Post({
            title: req.body.composeInputTitle,
            content: req.body.composeInputPostBody
        });
        post.save().then(function () {
            console.log('Post saved successfully');
            res.redirect('/');
        }).catch(function (err) {
            console.error(err);
        });
    });

    app.get('/posts/:postId', function(req, res) {
        const postId = req.params.postId;
        console.log('postId:', postId);
        
        Post.findOne({_id: postId})
          .then(function(post) {
            if (!post) {
              console.log("Post not found");
              res.status(404).send("Post not found");
              return;
            }
            
            console.log("Post found");
            res.render('post', {
              postTitle: post.title,
              postContent: post.content
            });
          })
          .catch(function(err) {
            console.log("Error occurred while finding the post:\n" + err.message);
            res.status(500).send("Error occurred while finding the post");
          });
      });
      

    app.listen(3000, function() {
        console.log("Server started on port 3000\nhttp://localhost:3000/");
    })

}