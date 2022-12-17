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
    origin: "*",
    credentials: true,
}))


const database = new Database();


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

    console.log(`ustawiam cookie id na ${result.data[0].id}`)
    res.cookie("id", result.data[0].id, {
        expires: new Date(Date.now() + 9999999),
        httpOnly: false,
        secure: false,
        sameSite: false,
    })

    return res.send({
        description: "Logowanie powiodło się",
        id: result.data[0].id,
        username: username
    });
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
    console.log(req.body)
    const result = await database.get_notes(req.body.id_university, req.body.id_degree_course, req.body.id_subject);

    if (result.success === false) {
        return res.status(400).send({ description: "Wystąpił błąd" });
    }

    return res.send(result.data);
})

app.post("/add_note", async (req: Request<{}, {}, { id_author: number, id_degree_course: number, id_subject: number, title: string, url: string }>, res) => {
    const result = await database.addNote(req.body.id_author, req.body.id_degree_course, req.body.id_subject, req.body.title, req.body.url);

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

app.post("/get_universities", async (_, res) => {
    const result = await database.getUniversities();

    if (result.success === false) {
        return res.status(400).send({ description: "Wystąpił błąd" });
    }

    return res.send(result.data);
})

app.post("/get_courses", async (req: Request<{}, {}, { id_university: number }>, res) => {
    const result = await database.getCourses(req.body.id_university);

    if (result.success === false) {
        return res.status(400).send({ description: "Wystąpił błąd" });
    }

    return res.send(result.data);
})

app.post("/get_subjects", async (_, res) => {
    const result = await database.getSubjects();

    if (result.success === false) {
        return res.status(400).send({ description: "Wystąpił błąd" });
    }

    return res.send(result.data);
})

app.post("/add_question", async (req: Request<{}, {}, { id_author: number, id_degree_course: number, id_subject: number, title: string, points: number, excercise_set: string, content: string }>, res) => {
    const result = await database.addQuestion(
        req.body.id_author,
        req.body.id_degree_course,
        req.body.id_subject,
        req.body.title,
        req.body.points,
        req.body.excercise_set,
        req.body.content,
    )

    if (result.success === false) {
        return res.status(400).send({ status: false });
    }

    return res.send({ status: true });
})


app.post("/add_answer", async (req: Request<{}, {}, { id_author: number, id_question: number, content: string }>, res) => {
    const result = await database.addAnswer(req.body.id_author, req.body.id_question, req.body.content);

    if (result.success === false) {
        return res.status(400).send({ status: false });
    }

    return res.send({ status: true });
})

app.listen(3000, () => {
    console.log("Listening on 3000");
})