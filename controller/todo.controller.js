const db = require('../db');
class TodoController{
    async createTodo(req, res){
        const {title, content, user_id} = req.body;
        const newTodo = await db.query(`INSERT INTO todo (title, content, user_id) VALUES ($1, $2, $3) RETURNING *`, [title, content, user_id])
        res.json(newTodo.rows[0]);
    }
    async getTodos(req, res){
        const todos = await db.query(`SELECT * FROM todo`)
        res.json(todos.rows)
    }
    async updateTodo(req, res){
        try{
            const {id, title, content} = req.body
            const user_id = req.user.id;
            const updateTodo = await db.query(`UPDATE todo SET title = $1, content =$2 WHERE id = $3 AND user_id = $4 RETURNING *`, [title, content, id, user_id])
            res.json(user.rows[0])
        }catch(err){
            res.status(500).json({ error: error.message });
    }}
    async deleteTodo(req, res){
        try{
            const {id, title, content} = req.body
            const user_id = req.user.id;
            const user = await db.query(`DELETE FROM person WHERE id = $1 AND user_id = $4`, [id, user_id])
            res.json(user.rows[0])
        }catch(err){}
        
    }
}

module.exports = new TodoController()