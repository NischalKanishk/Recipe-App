var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    nl2br  = require("nl2br"),
    bodyParser = require("body-parser");
//APP config
mongoose.connect("mongodb://localhost/recipeDB",{useNewUrlParser:true,useUnifiedTopology:true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


//Mongoose model config
var recipeSchema = new mongoose.Schema({
    recipeName : {type: String},
    recipeDesc : {type: Array},
    recipeImage: {type: String},
    recipeTime : {type: String},
    recipeLike : {type: Number} 
});

var Recipe = mongoose.model("Recipe", recipeSchema);


//Routes
app.get("/", function(req, res){
    res.render("recipes");
});
app.get("/recipes", function(req, res){
    Recipe.find({}, function(err, recipes){
        if(err){
            console.log("Error");
        }
        else {
            res.render("display", {recipes: recipes});
        }
    })
});

//NEW route
app.get("/recipes/new", function(req, res){
    res.render("new");
});

//Create Route
app.post("/recipes", function(req, res){
    Recipe.create(req.body.recipe, function(err, newRecipe){
        if(!err){
            res.redirect("/recipes");
        }
    })
});

//show Route
app.get("/recipes/:id", function(req, res){
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(!err){
            res.render("show", {recipe: foundRecipe});
        }
    })
});

//Edit route
app.get("/recipes/:id/edit",function(req,res){
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(!err){
            res.render("edit", {recipe: foundRecipe});
        }
    })
});

//Update route
app.put("/recipes/:id", function(req, res){
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err,updatedRecipe){
        if(!err){
            res.redirect("/recipes/"+req.params.id);
        }
    })
});

//DELETE route
app.delete("/recipes/:id",function(req, res){
    Recipe.findByIdAndRemove(req.params.id, function(err){
        if(!err){
            res.redirect("/recipes");
        }
    })
})


app.listen(3000, function(){
    console.log("server started at localhost:3000");
})