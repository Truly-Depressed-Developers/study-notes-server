import Express from "express"
import Database from "./Database";
import bodyParser from "body-parser";

const app = Express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


const database = new Database();

// database.get_questions()
database.login("admin", "admin")

app.get("/", (_, res) => {
    res.send("Hello world!");
})

app.post("/login", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({ description: "Wystąpił błąd logowania" });
    }

    const username = req.body.username.toString()
    const password = req.body.password.toString()
    const result = await database.login(username, password)

    if (result.success === false || result.data.length !== 1) {
        return res.status(400).send({ description: "Wystąpił błąd logowania" });
    }

    res.cookie("id", result.data[0].id)

    return res.send({ description: "Logowanie powiodło się" });
})


app.listen(3000, () => {
    console.log("Listening on 3000");
})