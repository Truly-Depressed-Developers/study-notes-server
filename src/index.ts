import Express, { Request } from "express"
import Database from "./Database";
import bodyParser from "body-parser";
import cors from "cors"

const app = Express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors({
    origin: "*"
}))


const database = new Database();

// database.get_questions()
database.login("admin", "admin")

app.get("/", (_, res) => {
    res.send("Hello world!");
})

app.post("/login", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({ description: "Nie podano username lub password" });
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

// : Request<{}, {}, { id_degree_course: number | null, id_subject: number | null}>
app.post("/get_questions", async (req: Request<{}, {}, { id_university: number | undefined, id_degree_course: number | undefined, id_subject: number | undefined }>, res) => {
    const result = await database.getQuestions(req.body.id_university, req.body.id_degree_course, req.body.id_subject);

    if (result.success === false) {
        return res.status(400).send({ description: "Wystąpił błąd" });
    }

    return res.send(result.data);
})

app.post("/get_notes", async (req: Request<{}, {}, { id_university: number | undefined, id_degree_course: number | undefined, id_subject: number | undefined }>, res) => {
    const result = await database.get_notes(req.body.id_university, req.body.id_degree_course, req.body.id_subject);

    if (result.success === false) {
        return res.status(400).send({ description: "Wystąpił błąd" });
    }

    return res.send(result.data);
})

app.post("/add_note", async (req: Request<{}, {}, { id_author: number, id_degree_course: number, id_subject: number, title: string, content: string }>, res) => {
    const result = await database.addNote(req.body.id_author, req.body.id_degree_course, req.body.id_subject, req.body.title, req.body.content);

    if (result.success === false) {
        return res.status(400).send({ status: false })
    }

    return res.send({ status: true });
});

app.post("/get_one_question", async (req: Request<{}, {}, { id: number | undefined }>, res) => {
    if (req.body.id === undefined) return res.status(400).send({ description: "Nie podano id" });
    const result = await database.getOneQuestion(req.body.id);

    if (result === null) return res.status(400).send({ description: "Wystąpił błąd" });

    return res.send(result);
})

app.post("/get_one_note", async (req: Request<{}, {}, { id: number | undefined }>, res) => {
    if (req.body.id === undefined) return res.status(400).send({ description: "Nie podano id" });
    const result = await database.getOneNote(req.body.id);

    if (result === null) return res.status(400).send({ description: "Wystąpił błąd" });
    console.log(result)
    return res.send(result);
})

// app.post("/get_question", async())

app.post("/register", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send({ description: "Nie podano username lub password" });
    }

    const username = req.body.username.toString()
    const password = req.body.password.toString()

    const userExistsResult = await database.getUserID(username)
    if (userExistsResult.success === false) {
        return res.status(400).send({ description: "Wystąpił błąd sprawdzania czy użytkownik istnieje" });
    }
    if (userExistsResult.data.length > 0) {
        return res.status(400).send({ description: "Taki użytkownik już istnieje" });
    }

    const registerResult = await database.register(username, password)

    if (registerResult.success === false) {
        return res.status(400).send({ description: "Wystąpił błąd rejestracji" });
    }

    return res.send({ description: "Rejestracja powiodła się" });
})

app.listen(3000, () => {
    console.log("Listening on 3000");
})