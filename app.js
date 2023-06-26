const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');

const homeStartingContnet = "homeStartingContnet...";
const aboutContent = "aboutContent...";
const contactContenet = "contactContenet...";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const posts = [];

app.get('/', function(req, res) {
    res.render('home', {
        startingContnet: homeStartingContnet, 
        posts: posts
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
    const post = {
        title: req.body.composeInputTitle,
        content: req.body.composeInputPostBody
    };
    posts.push(post);
    res.redirect('/');
});

app.get('/posts/:postTitle', function(req, res){
    let match = false;
    const givenPostTitle = req.params.postTitle;
    for (let i = 0; i < posts.length; i++) {
        const currentTitle = posts[i].title;
        if (_.lowerCase(currentTitle) === _.lowerCase(givenPostTitle)) {
            match = true;
            res.render('post', {
                postTitle: currentTitle, 
                postContent: posts[i].content
            });
            break;
        }    
    };
    if (!match) {
        console.log('No Match Found!');
    }
});


app.listen(3000, function() {
    console.log("Server started on port 3000\nhttp://localhost:3000/");
})