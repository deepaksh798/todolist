const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

//console.log(date());

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welome to your todolist!",
});

const item2 = new Item({
  name: "Hit + button to add a new item.",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

async function getItems() {
  const Items = await Item.find({});
  return Items;
}

app.get("/", function (req, res) {
  console.log("inside the get");
  getItems().then((foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defultItems)
        .then(function () {
          console.log("Successfully saved defult items to DB");
        })
        .catch(function (err) {
          console.log(err);
        });
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

async function getList() {
  const Lists = await Lists.find({});
  return Lists;
}

app.get("/:customListName", function (req, res) {
  const customListName = req.params.customListName;
  console.log("inside the custolistname");
  console.log(customListName);

  List.findOne({ name: customListName })
    .then(function (foundList) {
      console.log("foundlist---------------->>>>>>", foundList);
      if (!foundList) {
        console.log("not exists");
        console.log("default Items---###################", defultItems);
        const list = new List({
          name: customListName,
          items: defultItems,
        });
        console.log("list------------@@@@@@@@@@@@@@@@@@@", list);
        list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch(function () {
      console.log("exists23");
    });

  // List.findOne({ name: customListName }, function (err, foundList) {
  //   if (!err) {
  //     if (!foundList) {
  //       console.log("Doesn't exit!");
  //     } else {
  //       console.log("Exists!");
  //     }
  //   }
  // });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  console.log("itemname", itemName);
  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  // Item.findByIdAndRemove(checkedItemId, function (err) {
  //   if (!err) {
  //     console.log("Seccessfully deleted checked item");
  //     res.redirect("/");
  //   }
  // });

  Item.findByIdAndRemove(checkedItemId)
    .then(function () {
      console.log("successfully deleted");
      res.redirect("/");
    })
    .catch(function (err) {
      console.log("error");
    });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(4000, function () {
  console.log("Server started on port 4000");
});
