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

    async get_questions(id_university: number | undefined, id_degree_course: number | undefined, id_subject: number | undefined) {
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

        type queryType = {
            id: number,
            username: string,
            university: string,
            degree_course: string,
            subject: string,
            title: string,
            timestamp: string,
        }
        return await this.query<queryType>(sql, bindsArr);
    }

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