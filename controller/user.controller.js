const pool = require("../db");
const session = require('express-session');
class UserController {
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, password } = req.body;
      const userId = req.session.user.id;
      if (userId !== req.params.id) {
        return res
          .status(403)
          .json({ error: "Нет доступа к редактированию данного аккаунта" });
      }
      const user = await pool.query(
        `UPDATE person SET username = $1, email =$2, password =$3 WHERE id = $4 RETURNING *`,
        [username, email, password, userId]
      );
      res.json(user.rows[0]);
    } catch (error) {}
  }

  async deleteUser(req, res) {
    try {
      const userId = req.session.user.id;
      const deleteId = req.params.id;
      if (userId !== deleteId) {
        return res
          .status(403)
          .json({ error: "Нет доступа к удалению данного аккаунта" });
      }
      const user = await pool.query(`DELETE FROM person WHERE id = $1`, [
        userId,
      ]);
      req.session.destroy((err) => {
        if (err) {
          res.status(500).json({ error: "Ошибка удаления сессии" });
        } else {
          res.status(200).json({ message: "Аккаунт удален успешно" });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
