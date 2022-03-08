const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const {
  render
} = require("express/lib/response");

const homeStartingContent = "Blog - computers : a website that contains online personal reflections, comments, and often hyperlinks, videos, and photographs provided by the writer.";
const aboutContent = "This blog was built as part of a web development boot camp, using: HTML, CSS, JS, Node.js, Express.js and EJS.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

let posts = [];

// Home route 
app.get("/", function (req, res) {
  // ejs file name, key: value
  res.render("home", {
    homeStartingContent: homeStartingContent,
    posts: posts
  });

});

// About route
app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

// Contact route
app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

// Compose route
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = {
    title: req.body.composeInputTitle,
    content: req.body.composeInputPostBody
  };

  posts.push(post);

  res.redirect("/");
});

// Post route
app.get("/post/:title", function (req, res) {
  const title = req.params.title;
  var match = false;

  function isPostExist(title) {
    // iterates over all the titles
    posts.forEach(function (post) {
      // checks if the current title match the given title
      if (_.lowerCase(post.title) === _.lowerCase(title)) {
        match = true;
        // console.log("Match found!");
        res.render("post", {
          title: post.title,
          content: post.content
        });
      }
    })

    // if (match === false) {
    //   console.log("Not a match!");
    // }
  }

  isPostExist(title);

});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});