import mysql from "mysql"

export type QueryResult<T> = { success: false, error: string | undefined } | { success: true, data: T[] };

const host = "10.200.2.96"
const user = "sheepyourhack4"
const password = "h4VktwjGtf5cjy"
const database = "sheepyourhack4"


export default class Database {
    connection: mysql.Connection

    constructor() {
        this.connection = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });

        this.connection.connect(err => {
            if (err) throw err;
            console.log("Connected!");
        });
    }

    async login(username: string, password: string) {
        const sql = "SELECT id FROM users WHERE username=? AND password=?"
        return await this.query<{ id: number }>(sql, [username, password]);
    }

    async getQuestions(id_university: number | undefined, id_degree_course: number | undefined, id_subject: number | undefined) {
        let whereStatement: string[] = [];
        let bindsArr: any[] = [];

        for (const el of [{ id_university }, { id_degree_course }, { id_subject }]) {
            if (Object.values(el)[0] === undefined || Object.values(el)[0] == -1) continue;

            whereStatement.push(`${Object.keys(el)[0]}=?`)
            bindsArr.push(Object.values(el)[0])
        }

        const sql = `SELECT questions.id, users.username, universities.name as university, degree_courses.name as degree_course, subjects.name as subject, questions.title, questions.timestamp
            FROM questions 
            INNER JOIN users ON questions.id_author = users.id
            INNER JOIN degree_courses ON questions.id_degree_course = degree_courses.id
            INNER JOIN subjects ON questions.id_subject = subjects.id
            INNER JOIN universities ON degree_courses.id_university = universities.id
            ${whereStatement.length != 0 ? `WHERE ${whereStatement.join(" AND ")}` : ""}
            `

        type queryQuestionType = {
            id: number,
            username: string,
            university: string,
            degree_course: string,
            subject: string,
            title: string,
            timestamp: string,
        }

        return await this.query<queryQuestionType>(sql, bindsArr);
    }

    async getOneQuestion(id: number) {
        const sql = `SELECT questions.id, users.username, universities.name as university, degree_courses.name as degree_course, subjects.name as subject, questions.title, questions.url, questions.timestamp
            FROM questions 
            INNER JOIN users ON questions.id_author = users.id
            INNER JOIN degree_courses ON questions.id_degree_course = degree_courses.id
            INNER JOIN subjects ON questions.id_subject = subjects.id
            INNER JOIN universities ON degree_courses.id_university = universities.id
            WHERE questions.id = ?
        `

        type queryQuestionType = {
            id: number,
            username: string,
            university: string,
            degree_course: string,
            subject: string,
            title: string,
            url: string,
            timestamp: string,
        }

        let questionInfo = await this.query<queryQuestionType>(sql, [id]);

        const sql1 = `SELECT users.username, question_answers.content, question_answers.timestamp, question_answers.upvotes, question_answers.best_answer
        FROM question_answers
        INNER JOIN users ON question_answers.id_author = users.id
        WHERE question_answers.id_question = ?
        `

        type queryAnswerType = {
            username: string,
            content: string,
            timestamp: string,
            upvotes: number,
            best_answer: 0 | 1
        };
        const answersInfo = await this.query<queryAnswerType>(sql1, [id]);

        if (questionInfo.success === false || answersInfo.success === false) {
            return null;
        }

        if (questionInfo.data[0] == undefined) {
            return {};
        }
        return {
            ...questionInfo.data[0],
            answers: answersInfo.data
        }
    }

    async getOneNote(id: number) {
        const sql = `SELECT notes.id, users.username, universities.name as university, degree_courses.name as degree_course, subjects.name as subject, notes.title, notes.url, notes.timestamp, notes.upvotes, notes.approved
            FROM notes 
            INNER JOIN users ON notes.id_author = users.id
            INNER JOIN degree_courses ON notes.id_degree_course = degree_courses.id
            INNER JOIN subjects ON notes.id_subject = subjects.id
            INNER JOIN universities ON degree_courses.id_university = universities.id
            WHERE notes.id = ?
        `

        type queryNoteType = {
            id: number,
            username: string,
            university: string,
            degree_course: string,
            subject: string,
            title: string,
            url: string,
            timestamp: string,
            upvotes: number,
            approved: boolean,
        }

        let noteInfo = await this.query<queryNoteType>(sql, [id]);

        if (noteInfo.success === false) {
            return null;
        }

        if (noteInfo.data[0] == undefined) {
            return {};
        }
        return noteInfo.data[0]
    }

    async get_notes(id_university: number | undefined, id_degree_course: number | undefined, id_subject: number | undefined) {
        console.log(id_university, id_degree_course, id_subject)

        let whereStatement: string[] = [];
        let bindsArr: any[] = [];

        for (const el of [{ id_university }, { id_degree_course }, { id_subject }]) {
            if (Object.values(el)[0] === undefined || Object.values(el)[0] == -1) continue;

            whereStatement.push(`${Object.keys(el)[0]}=?`)
            bindsArr.push(Object.values(el)[0])
        }

        const sql = `SELECT notes.id, users.username, universities.name as university, degree_courses.name as degree_course, subjects.name as subject, notes.title, notes.timestamp, notes.upvotes, notes.approved
            FROM notes 
            INNER JOIN users ON notes.id_author = users.id
            INNER JOIN degree_courses ON notes.id_degree_course = degree_courses.id
            INNER JOIN subjects ON notes.id_subject = subjects.id
            INNER JOIN universities ON degree_courses.id_university = universities.id
            ${whereStatement.length != 0 ? `WHERE ${whereStatement.join(" AND ")}` : ""}
            `

        type queryType = {
            id: number,
            username: string,
            university: string,
            degree_course: string,
            subject: string,
            title: string,
            timestamp: string,
            upvotes: number,
            approved: boolean,
        }
        return await this.query<queryType>(sql, bindsArr);
    }

    async addNote(id_author: number, id_degree_course: number, id_subject: number, title: string, url: string) {
        const sql = `INSERT INTO notes (id_author, id_degree_course, id_subject, title, url)
                    VALUES(?, ?, ?, ?, ?);
        `

        return await this.query(sql, [id_author, id_degree_course, id_subject, title, url])
    }

    async getUniversities() {
        const sql = "SELECT * FROM universities"

        type queryQuestionType = {
            id: number,
            name: string,
        }

        return await this.query<queryQuestionType>(sql);
    }

    async getCourses(id_university: number | undefined) {
        type queryQuestionType = {
            id: number,
            name: string,
        }
        if (id_university) {
            const sql = "SELECT id, name FROM degree_courses WHERE id_university=?"
            return await this.query<queryQuestionType>(sql, [id_university]);
        } else {
            const sql = "SELECT id, name FROM degree_courses"
            return await this.query<queryQuestionType>(sql);
        }
    }

    async getSubjects() {
        const sql = "SELECT * FROM subjects"

        type queryQuestionType = {
            id: number,
            name: string,
        }

        return await this.query<queryQuestionType>(sql);
    }

    async addQuestion(id_author: number, id_degree_course: number, id_subject: number, title: string, content: string) {
        const sql = "INSERT INTO questions (id_author, id_degree_course, id_subject, title, content) VALUES (?, ?, ?, ?, ?)"
        return await this.query(sql, [id_author, id_degree_course, id_subject, title, content]);
    }

    async getUserID(username: string) {
        const sql = "SELECT id FROM users WHERE username=?"
        return await this.query<{ id: number }>(sql, [username]);
    }

    async register(username: string, password: string) {
        const sql = "INSERT INTO users (username, password) VALUES (?, ?)"
        return await this.query(sql, [username, password]);
    }

    async addAnswer(id_author: number, id_question: number, content: string) {
        const sql = "INSERT INTO question_answers (id_author, id_question, content) VALUES (?, ?, ?)"
        return await this.query(sql, [id_author, id_question, content]);
    }

    // get_questions() {
    //     const sql = "SELECT * FROM questions"
    //     this.connection.query(sql, (err, result) => {
    //         if (err) throw err;
    //         console.log("Result: ", result);
    //     });
    // }

    query = <T>(query: string, values: any[] = []) => {
        return new Promise<QueryResult<T>>((resolve) => {
            return this.connection.query(query, values, (err, result) => {
                if (err) {
                    return resolve({
                        success: false,
                        error: err.sqlMessage
                    });
                }
                return resolve({
                    success: true,
                    data: result
                });
            });
        })
    }
}