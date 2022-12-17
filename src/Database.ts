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