import Express from "express"
import Database from "./Database";

const app = Express();
const database = new Database();

database.connect()
database.get_questions()

app.get("/", (_, res) => {
    res.send("Hello world!");
})

app.listen(3000, () => {
    console.log("Listening on 3000");
})