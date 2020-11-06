//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const lodash = require("lodash");

// const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
// const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const posts = [];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-deepty:abcd1234@cluster0.uxtrt.mongodb.net/journal", { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect("mongodb://localhost:27017/journal", { useNewUrlParser: true, useUnifiedTopology: true });
const contentSchema = mongoose.Schema({
    name: String,
    desc: String
});

const contentModel = mongoose.model("Content", contentSchema);
const blogModel = mongoose.model("Blog", contentSchema);
const homeStartingContent = new contentModel({
    name: "homeStartingContent",
    desc: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});
const aboutContent = new contentModel({
    name: "aboutContent",
    desc: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."
});
const contactContent = new contentModel({
    name: "contactContent",
    desc: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero."
});

const deafaultArray = [homeStartingContent, aboutContent, contactContent];
contentModel.find({}, function(err, foundResult) {
    if (foundResult.length == 0) {
        contentModel.insertMany(deafaultArray, function(err, result) {
            if (!err) {
                console.log("Successfully added contents")
            }
        });
    }
});

app.get("/", function(req, res) {

    contentModel.findOne({ name: "homeStartingContent" }, function(err, foundResult) {
        if (foundResult) {
            blogModel.find({}, function(err, foundBlogs) {
                if (foundBlogs) {
                    res.render("home", { Contents: foundResult.desc, postContents: foundBlogs });
                }
            });



        }
    });

});

app.get("/contact", function(req, res) {
    contentModel.findOne({ name: "aboutContent" }, function(err, foundResult) {
        if (foundResult) {
            res.render("contact", { Contents: foundResult.desc });

        }
    });
})

app.get("/about", function(req, res) {
    contentModel.findOne({ name: "contactContent" }, function(err, foundResult) {
        if (foundResult) {
            res.render("contact", { Contents: foundResult.desc });

        }
    });
})
app.get("/compose", function(req, res) {
    res.render("compose");
})

app.post("/compose", function(req, res) {
    let title = req.body.title;
    let post = req.body.post;
    const postObject = new blogModel({
        name: lodash.lowerCase(title),
        desc: post
    });
    postObject.save(function(err, result) {
        if (!err) {
            console.log("new blog saved successfully!");
        }
    });
    // posts.push(postObject);
    res.redirect("/");
});
app.get("/posts/:pName", function(req, res) {
    let requestedParam = lodash.lowerCase(req.params.pName);
    console.log(requestedParam);

    blogModel.findOne({ name: requestedParam }, function(err, foundResult) {
        if (foundResult) {
            res.render("post", { post: foundResult });
        }
    });
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
});