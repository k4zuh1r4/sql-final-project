import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const poolOpener = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
}).promise();
export async function getData() {
    const result = await poolOpener.query('SELECT * FROM netflix_titles');
    console.log(result[0]);
}
export async function getID(id) {
    const [rows] = await poolOpener.query(`
        SELECT * 
        FROM netflix_titles
        WHERE id = ?`, [id]
    );
    return rows[0];
}

export async function addEntry(show_id, type, title, director, cast, country, date_added, release_year, rating, duration, listed_in, description) {
    const result = await poolOpener.query(
        'INSERT INTO netflix_titles (show_id, type, title, director, cast, country, date_added, release_year, rating, duration, listed_in, description) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [show_id, type, title, director, cast, country, date_added, release_year, rating, duration, listed_in, description]
    );
    await poolOpener.query('ALTER TABLE netflix_titles MODIFY id INTEGER NOT NULL AUTO_INCREMENT;');
    return {
        show_id, type, title, director, cast, country, date_added, release_year, rating, duration, listed_in, description
    };
}
export async function removeEntry(id) {
    await poolOpener.query(`
        DELETE FROM netflix_titles WHERE id= ?`, [id]
    );
    return 'Entry removed.';
}
export async function percentageReport() {
     const result = await poolOpener.query(`SELECT type, COUNT(*) AS count, (COUNT(*) / (SELECT COUNT(*) FROM netflix_titles) * 100) AS percentage FROM netflix_titles GROUP BY type;`);
     return result[0];
}
export async function countryCount() {
    const result = await poolOpener.query(`SELECT country, COUNT(*) AS total_movies FROM netflix_titles WHERE country IS NOT NULL AND country != '' GROUP BY country ORDER BY total_movies DESC LIMIT 10;`);
    return result[0];
}
//const test = await getID(2);
//console.log(test.show_id);
//const testLog = await addEntry('s400', 'Movie', 'The Room', 'Tommy Wiseau', 'Tommy Wiseau, Greg Sestero', 'USA', '2019-01-01', 2003, 'R', '99 min', 'Drama, Comedy', 'test desc');
//console.log(testLog);
//const test2 = await percentageReport();
//console.log(test2);