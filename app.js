import client from "./database.js";
import express  from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", async (req,res) => {
    try {
        let query = "SELECT * FROM Posts";
        let result = await client.query(query);
        console.table(result.rows);
        res.render("index.ejs", {
            posts: result.rows,
        });
    } catch (error) {
        console.log(error.message);
    }
});

app.get("/edit/:id", async (req,res) => {
    const id = req.params.id;

    try {
        let query = "SELECT * FROM Posts WHERE id = $1";
        let result = await client.query(query,[id]);
        res.render("edit.ejs", {
            editPost: result.rows[0],
        });
    } catch (error) {
        console.log(error.message);
    }
})

app.post("/edit/:id", async (req,res) => {
    const id = req.params.id;
    const title = req.body.title;
    const content = req.body.content;

    try {
        let query = "SELECT EditValues($1,$2,$3)";
        await client.query(query,[id,title,content]);
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
        console.log("Edit-Post klappt nicht!");
    }
});

app.post("/add-post", async (req,res) => {
    const title = req.body.title;
    const content = req.body.content;

    try {
        let query = "INSERT INTO Posts(title,content) VALUES ($1,$2)";
        await client.query(query,[title,content]);
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
        console.log("Post konnte nicht hinzugefügt werden.");
    }

});

app.post("/delete/:id", async (req,res) => {
    const id = req.params.id;
    try {
        let query = "DELETE FROM Posts WHERE id = $1";
        await client.query(query,[id]);
        res.redirect("/");
    } catch (error) {
        console.log(error.message);
    }
})

app.listen(port, 
    console.log("Server is running on Port " + port)
);