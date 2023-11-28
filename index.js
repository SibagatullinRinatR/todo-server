const express = require('express');
const userRouter = require('./routes/user.router')
const todoRouter = require('./routes/todo.router')
const authRouter = require('./routes/auth.router')
const PORT = process.env.PORT || 8000

const app = express();
app.use(express.json());
app.use('/api', userRouter)
app.use('/api/', todoRouter)
app.use('/api/auth', authRouter)

app.listen(PORT, () => console.log(`server start on port = ${PORT}`))