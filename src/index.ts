import Express from "express"

const app = Express();

app.get("/", (_, res) => {
    res.send("Hello world!");
})

app.listen(3000, () => {
    console.log("Listening on 3000");
})