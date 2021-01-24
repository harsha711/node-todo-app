const express = require("express");

const dotenv = require("dotenv");

const path = require("path");

const mongoose = require("mongoose");

const TodoTask = require('./models/TodoTask');

dotenv.config();

mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true}, () =>{
    console.log("Connected to db");

    app.listen(3000, () => console.log("server up and running"));
});

const app = express();

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");

app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
});

app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});

app
.route("/edit/:id")
.get((req,res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) =>{
        res.render("todoEdit.ejs", {todoTasks: tasks, idTask: id});
    });
})
.post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, {content: req.body.content}, err =>{
        if(err){
            return res.send(500, err);
        }
        res.redirect("/");
    });
});

app.route("/remove/:id")
.get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndDelete(id, (err) => {
        if(err){
            return res.send(500,err);
        }
        res.redirect("/");
    })
})