const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-abhi:test123@cluster0.x51oq.mongodb.net/blogDatabase");

const blog = {
    title:String,
    content:String
};
const blogs = mongoose.model("Blogs",blog);
const blog1 = new blogs({
    title:"Home",
    content:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book"
});


app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set("view engine","ejs");


app.get("/",function(req,res){
   
    blogs.find({},function(err,result){
        if(result.length===0){
            blogs.insertMany([blog1],function(res){
                if(err){
                    console.log("Something happend");
                }
            });
            res.redirect("/")

        }
        else{
            res.render("home",{blogList:result});
        }
    });
 });

app.get("/compose",function(req,res){
res.render("compose");
});

app.get("/posts/:postid",function(req,res){
    const postid = req.params.postid;
    blogs.findOne({_id:postid},function(err,result){
if(result){
    res.render("mainblogs",{heading: result.title,blog: result.content});
  
}
else{
    console.log("something happen")
}
    });

});



app.get("/about",function(req,res){
    res.render("mainblogs",{heading:"About",blog:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."});
 });

 app.get("/delete",function(req,res){
 blogs.find({},function(err,result){

    res.render("delete",{blogList:result});
 });
 });

 app.get("/delete/:postid",function(req,res){
const postid = req.params.postid;
blogs.findByIdAndDelete({_id:postid},function(err,result){
    if(!err){
        res.redirect("/");
    }
})
 });

app.post("/",function(req,res){
    const blog = new blogs({
        title:req.body.title,
        content:req.body.article
    });
    blog.save();
    
    res.redirect("/");



});

app.get("/contact",function(req,res){
    res.render("mainblogs",{heading:"Contact",blog:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."});
   });

   let port =process.env.PORT;
   if(port == null||port == " "){
       port=3000;
   }



app.listen(port,function(){
console.log("port start listening at 3000")
});