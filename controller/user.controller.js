const db = require('../db');
class UserController{
    async createUser(req, res){
        const {username, surname} = req.body;
        const newPerson = await db.query(`INSERT INTO person (username, surname) VALUES ($1, $2) RETURNING *`, [username, surname])
        res.json(newPerson.rows[0]);
    }
    async getUsers(req, res){
        const users = await db.query(`SELECT * FROM person`)
        res.json(users.rows)
    }
    async getOneUser(req, res){
        const id = req.params.id;
        const user = await db.query(`SELECT * FROM person WHERE id = $1`, [id])
        res.json(user.rows[0])
    }
    async updateUser(req, res){
        const {id, username, surname} = req.body
        const user = await db.query(`UPDATE person SET username = $1, surname =$2 WHERE id = $3 RETURNING *`, [username, surname, id])
        res.json(user.rows[0])
    }
    async deleteUser(req, res){
        const id = req.params.id;
        const user = await db.query(`DELETE FROM person WHERE id = $1`, [id])
        res.json(user.rows[0])
    }
}

module.exports = new UserController()