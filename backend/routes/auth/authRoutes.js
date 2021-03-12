const pool = require('../../db/init');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyToken = require('./token')

module.exports = (app) => {
    app.post('/login', async (req, res) => {
        console.log(req.body)
        let user = await pool.query(`select * from users where username='${req.body.username}'`);
        user = user.rows[0];
        if (!user) {
            return await res.json({notification: {isError: true, message: "Такого пользователя не существует"}})
        }
        if (! await bcrypt.compare(req.body.password, user.password)) {
            return await res.json({notification: {isError: true, message: "Введён неправильный пароль"}})
        }
        await jwt.sign({user}, 'secretkey',{expiresIn: '12h'}, async (err, token) => {
            if (err) {
                console.error(err);
                return await res.json({notification: {isError: true, message: "Произошла ошибка. Свяжитесь с администратором."}})
            }
            await res.cookie('token', token, {
                expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
                secure: false, // set to true if your using https
                httpOnly: true,
            });
            await res.json({notification: {isError: false, message: `Вход в аккаунт ${user.username} выполнен успешно`}});
        });
    });

    app.post('/logout', async (req, res) => {
        await res.cookie('token', "", {
            expires: new Date(Date.now()),
            secure: false, // set to true if your using https
            httpOnly: true,
        });
        await res.json({notification: {isError: false, message: "Вы вышли из аккаунта"}})
    });

    app.post('/register', async (req, res) => {
        let data = req.body;
        let saltRounds = 10;

        if (data.password1 && data.password2 && data.username && data.password1 === data.password2 && data.username.length < 33) {
            try {
                let hash = await bcrypt.hash(data.password1, saltRounds);
                await pool.query(`INSERT INTO users(username, password) VALUES ('${data.username}', '${hash}')`);
                await res.sendStatus(201)
            } catch (err) {
                await res.json({notification: {
                    isError: true, message: err.code === '23505' ? "Пользователь с таким логином уже существует" : "Ошибка регистрации"}});
            }
        } else {
            await res.json({notification: {isError: true, message: "Введены некорректные данные"}})
        }
    })
    app.post('/status', verifyToken, async (req, res) => {
      await res.json({notification: {isError: false, message: false}})
    })
};



