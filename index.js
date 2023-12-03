const express = require("express");
const session = require('express-session');
const flash = require('connect-flash');
const userRouter = require("./routes/user.router");
const todoRouter = require("./routes/todo.router");
const bcrypt = require("bcryptjs");
const corsMiddleware = require("./middleware/cors.middleware");

const db = require("./db");
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(flash());
app.use("/api", userRouter);
app.use("/api/", todoRouter);

db.connect();
// Настройка сессии
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// Класс для регистрации пользователя с хэшированием пароля
class Registration {
  async registerUser(username, email, password) {
    try {
      // Хэширование пароля перед сохранением в базе данных
      const hashedPassword = await bcrypt.hash(password, 10);

      const query =
        "INSERT INTO person (username, email, password) VALUES ($1, $2, $3)";
      const values = [username, email, hashedPassword];
      await client.query(query, values);
      return true;
    } catch (error) {
      throw new Error(`Ошибка при регистрации: ${error.message}`);
    }
  }
}

// Класс для аутентификации пользователя
class Authentication {
  async authenticateUser(email, password) {
    try {
      const query = "SELECT id, password FROM person WHERE email = $1";
      const result = await client.query(query, [email]);

      if (result.rows.length > 0) {
        const hashedPassword = result.rows[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (passwordMatch) {
          return result.rows[0].id; // Возвращаем ID пользователя при успешной аутентификации
        }
      }
      return false;
    } catch (error) {
      throw new Error(`Ошибка при аутентификации: ${error.message}`);
    }
  }
}

db.query(
  `CREATE TABLE IF NOT EXISTS person (
    id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY(id));
    CREATE TABLE IF NOT EXISTS todo (
    id INT GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(50),
    content VARCHAR(200) NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_person FOREIGN KEY (user_id) REFERENCES person(id));`
)
  .then(() => {
    console.log('Таблицы бд созданы');
  })
  .catch((error) => {
    console.error("Ошибка при создании таблицы:", error);
  });

const registration = new Registration();
const authentication = new Authentication();

app.use(express.json());

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await registration.registerUser(username, email, password);
    res.status(200).send("Пользователь зарегистрирован");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/login', (req, res) => {
  res.send('Login page. Please, authorize.');
});

app.use((req, res, next) => {
  if (req.user) next();
  else res.redirect('/login');
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userId = await authentication.authenticateUser(email, password);
    if (userId) {
      req.session.user = { id: userId }; // Сохраняем ID пользователя в сессии
      res.status(200).send("Вы успешно авторизовались");
    } else {
      res.status(401).send("Неверные учетные данные");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

class SessionManager {
  constructor() {}

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send("Ошибка разлогинивания");
      } else {
        res.clearCookie("connect.sid");
        res.status(200).send("Вы успешно разлогинились");
      }
    });
  }
}

const sessionManager = new SessionManager();

app.post("/logout", (req, res) => {
  sessionManager.logout(req, res);
});

app.listen(PORT, () => console.log(`server start on port = ${PORT}`));