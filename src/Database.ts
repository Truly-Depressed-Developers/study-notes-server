import mysql from "mysql"

const host = "10.200.2.96"
const user = "sheepyourhack4"
const password = "h4VktwjGtf5cjy"
const database = "sheepyourhack4"

export default class Database {
    connection: mysql.Connection | null = null

    connect() {
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

    get_questions() {
        if (!this.connection) return;
        const sql = "SELECT * FROM questions"
        this.connection.query(sql, (err, result) => {
            if (err) throw err;
            console.log("Result: ", result);
        });
    }
}