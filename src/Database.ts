import mysql from "mysql"

export type QueryResult<T> = { success: false, error: string | undefined } | { success: true, data: T[] };

const host = "10.200.2.96"
const user = "sheepyourhack4"
const password = "h4VktwjGtf5cjy"
const database = "sheepyourhack4"

type queryQuestionType = {
    id: number,
    username: string,
    university: string,
    degree_course: string,
    subject: string,
    title: string,
    timestamp: string,
}

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
            if (Object.values(el)[0] === undefined) continue;

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

        return await this.query<queryQuestionType>(sql, bindsArr);
    }

    async getOneQuestion(id_question: number) {
        const sql = `SELECT questions.id, users.username, universities.name as university, degree_courses.name as degree_course, subjects.name as subject, questions.title, questions.timestamp
            FROM questions 
            INNER JOIN users ON questions.id_author = users.id
            INNER JOIN degree_courses ON questions.id_degree_course = degree_courses.id
            INNER JOIN subjects ON questions.id_subject = subjects.id
            INNER JOIN universities ON degree_courses.id_university = universities.id
            WHERE questions.id = ?
        `

        let questionInfo = await this.query<queryQuestionType>(sql, [id_question]);

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
        const answersInfo = await this.query<queryAnswerType>(sql1, [id_question]);

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

    async getUserID(username: string) {
        const sql = "SELECT id FROM users WHERE username=?"
        return await this.query<{ id: number }>(sql, [username]);
    }

    async register(username: string, password: string) {
        const sql = "INSERT INTO users (username, password) VALUES (?, ?)"
        return await this.query(sql, [username, password]);
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