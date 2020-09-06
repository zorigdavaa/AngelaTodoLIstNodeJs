const express = require("express");
const bodyParser = require("body-parser");
const date=require(__dirname+"/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("wwwroot"));



const items=["Buy Foor","Cook food","Eat Food"];
const work=[];

app.set("view engine", "ejs");
app.get("/", (req, res) => {
  const day=date.getDay();
  res.render("list", { listTitle: day , items:items});
});
app.post("/",(req,res)=>{
  const newTodoItem=req.body.newTodo;
    items.push(newTodoItem);
    res.redirect("/");
})
app.get("/work",(req,res)=>{
  res.render("list",{listTitle:"Works to do",items:work})
})
app.post("/work",(req,res)=>{
  const item= req.body.newTodo;
  work.push(item);
  res.redirect("/work");
})
app.get("/about",(req,res)=>{
  res.render("about")
})

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});


