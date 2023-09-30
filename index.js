import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
let items =[];
let works=[];

main().catch(err => {
    console.log(err.message);
});

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength:1,
        maxlength:30,
        required: [true,"why no name?"]
    }
});

const workSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength:1,
        maxlength:30,
        required: true
    }
})

const item = mongoose.model("Item",itemSchema);
const work = mongoose.model("Work",workSchema);

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/todoDB");
    
    app.post("/",async function(req,res){
        let n = req.body.newItem;
        const newItem = new item({
            name: n
        });

        await item.create(newItem);
        res.redirect("/");
    });
    
}
app.get("/",async function(req,res){
    items = await item.find();
    res.render("today.ejs",{newitems:items});
});

app.post("/tdelete",async function(req,res){
    let id = req.body.ch
    await item.deleteOne({
        _id: id
    });
    res.redirect("/");
});


app.get("/work",async function(req,res){
    works = await work.find();
    res.render("work.ejs",{newItems:works});
})

app.post("/work",async function(req,res){
    let m = req.body.newItem;
    const n = new work({
        name: m
    });
    await work.create(n);
    res.redirect("/work");
});

app.post("/wdelete",async function(req,res){
    let id = req.body.ch
    await work.deleteOne({
        _id: id
    });
    res.redirect("/work");
});

app.listen(port,function(){
    console.log(`Server is running at port ${port}.`);
});