var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var methodOverride = require("method-override");
//var expressSanitizer = require("express-sanitizer");
mongoose.connect("mongodb://localhost/image_gallary");

app.set("view engine","ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//app.use(expressSanitizer());
app.use(methodOverride("_method"));
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date, default:Date.now}
}); 

var Blog = mongoose.model("Blog",blogSchema);

///ResFul Routes
Blog.create(
{
	title:"Punjabi Suit",
	image:"./images/i1.jpg",
	body:"Image in a Punjabi Look. Single Selfie"
}
);

app.get("/",function(req,res){
	res.redirect("/blogs");

});
//index route
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("ERROR!");
		}
		else{
			res.render("index",{blogs:blogs});
		}
	});
});
//new route
app.get("/blogs/new",function(req,res){

	res.render("new");
})
//create route

app.post("/blogs",function(req,res){

    Blog.create(req.body.blog,function(err,newBlog){
      if(err){
      	res.render("new");
      }
      else{
      	res.redirect("/blogs");
      }
    });
});


//show page

app.get("/blogs/:id",function(req,res){
 Blog.findById(req.params.id,function(err,foundBlog){
   if(err){
   	res.redirect("/blogs");
   }
   else{
   	res.render("show",{blog:foundBlog});
   }
 });
});

//edit route
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
       if(err){
          	res.redirect("/blogs");
       }else{
            res.render("edit",{blog:foundBlog});
       }
	});
});


//Update Route
app.put("/blogs/:id",function(req,res){
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
  	if(err){
       res.redirect("/blogs");
  	}else{
       res.redirect("/blogs/"+req.params.id);
  	}
    
  });
});

//delete route

app.delete("/blogs/:id",function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err){
   	if(err){
   		res.redirect("/blogs");
   	}
   	else{
        res.redirect("/blogs");
   	}
   });
});
app.listen(3000,process.env.IP,function(){
	console.log("Server is Running");
});