const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');
const { render } = require('ejs');


//express app
const app = express();

//connect to mongodb

const dbURI = 'mongodb+srv://netNinja:cookies101@nodetuts.khgus7i.mongodb.net/nodetuts';
mongoose.connect(dbURI)
//listen for request
    .then((result)=> app.listen(3000))
    .catch((err)=> console.log(err))

//register view engine
app.set('view engine', 'ejs');

//middleware & static files
app.use(express.static('public'))
app.use(morgan('dev'));
///MUST HAVE FOR POST
app.use(express.urlencoded({extended:true}));

//routes
app.get('/', (req, res) => {
    res.redirect('/blogs');
});


app.get('/about', (req, res) => {
    res.render('about', {title:'About'});
    //res.send('<p>about page</p>');
});

//blog routes

app.get('/blogs', (req,res)=>{
    Blog.find().sort({createdAt: -1})
        .then((result)=>{
            res.render('index', {title:'All Blogs', blogs:result});
        })
        .catch((err)=>{
            console.log(err);
        });
});

///POST BLOGS
app.post('/blogs',(req,res)=>{
    const blog = new Blog(req.body);
    blog.save()
        .then((result)=>{
            res.redirect('/blogs');
        })
        .catch((err)=>{
            console.log(err);
        })

})

app.get('/blogs/:id', (req,res)=> {
    const id = req.params.id;
    Blog.findById(id)
        .then(result=>{
            res.render('details',{blog:result,title:'Blog Details'});
        })
        .catch((err)=>{
            console.log(err);
        });
})

app.delete('/blogs/:id', (req,res) => {
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result=>{
        res.json({redirect:'/blogs'})
    })
    .catch((err)=>{console.log(err);
    });
})

app.get('/blogs/create', (req,res) => {
    res.render('create', {title:'Create Blog'});

});

//404 page (must go at bottom)
app.use((req,res) => {
    res.status(404).render('404', {title: '404'});

})