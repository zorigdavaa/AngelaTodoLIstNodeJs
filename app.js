const express = require("express");
const bodyParser = require("body-parser");
const _=require("lodash");

const mongoose = require("mongoose");

const app = express();
// mongoose.connect("mongodb://localhost:27017/ToDoListDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect("mongodb+srv://adming-zorigoo:Saysomething1@cluster0.0r953.azure.mongodb.net/ToDoList?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("wwwroot"));

mongoose.set('useFindAndModify', false);

const itemsSchema = mongoose.Schema({
  name: String,
});
const Item = mongoose.model("item", itemsSchema);
const buyCoffee=new Item({
  name:"Buy a Item from the store"
});
const buyIceCream =new Item({
  name:"Buy an ice cream from the store"
});
const buyChokolate=new Item({
  name:"Buy a chokolate from the store"
});
const defaultItems=[buyCoffee,buyChokolate,buyIceCream];

const customItemSchema=mongoose.Schema({
  name:String,
  items:[itemsSchema]
});

const CustomItem=mongoose.model("CustomItem", customItemSchema);


// const items=["Buy Foor","Cook food","Eat Food"];
// const work=[];
const items = [];
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  Item.find({}, (err, foundItems) => {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length===0) {
        Item.insertMany(defaultItems,(err,doc)=>{
          if (err) {
            console.log(err);
          }
          else{
            console.log(doc);
          }
        })
        res.redirect("/");
      } else {
        res.render("list", { listTitle: "Today", items: foundItems });
      }
      

    }
  });


});
app.post("/", (req, res) => {
  const newTodoItemName = req.body.newTodo;
  const newItem=new Item({
    name:newTodoItemName
  });
  newItem.save();

  res.redirect("/");
});
// app.get("/work", (req, res) => {
//   res.render("list", { listTitle: "Works to do", items: work });
// });
// app.post("/work", (req, res) => {
//   const item = req.body.newTodo;
//   work.push(item);
//   res.redirect("/work");
// });
app.get("/about", (req, res) => {
  res.render("about");
});
app.post("/delete",(req,res)=>{
  const delTodoID= req.body.delTodo;
  const listName=req.body.listName;
  if (listName==="Today") {
    console.log(delTodoID);
    Item.findByIdAndDelete(delTodoID,(err)=>{
      if (err) {
        console.log(err);
      }
    })
    res.redirect("/");
  }else {
    CustomItem.findOneAndUpdate({name:listName},{$pull:{items:{_id:delTodoID}}},(err,foundList)=>{
      if (!err) {
        res.redirect("/"+listName);
      }
      else {
        console.log(err);
      }
    })

    // CustomItem.findOne({name:listName},(err,foundDoc)=>{
    //   if (!err) {
    //     console.log(foundDoc.items);
    //     var filtered= foundDoc.items.filter(element => element._id != delTodoID);
    //     console.log(filtered);
    //     foundDoc.items=filtered;
    //     foundDoc.save();
    //     res.redirect("/"+listName);
    //   }
    // });

  }

});
app.get("/:customList",(req,res)=>{
  const customItemName= _.capitalize(req.params.customList);
  CustomItem.findOne({name:customItemName},(err,foundDocument)=>{
    
    if (!err) {
      if (foundDocument==null) {
        
        const customItem=new CustomItem({
          name:customItemName,
          items:defaultItems
        })  
        customItem.save();
        res.redirect("/"+customItemName)
      } else{
        res.render("list", { listTitle: customItemName, items: foundDocument.items });
      }
    } else{
      console.log(err);
    }
  })
});
app.post("/:customList",(req,res)=>{
  const customItemName= req.params.customList
  const newTodo=req.body.newTodo;
  CustomItem.findOne({name:customItemName},(err,doc)=>{
    if (!err) {
      doc.items.push({name:newTodo});
      doc.save();
      res.redirect("/"+customItemName);
    } else {
      console.log(err);
    }
  });
})

app.listen(process.env.PORT || 3000, () => {
  console.log("App is listening on port 3000");
});



