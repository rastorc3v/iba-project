const router = require('express').Router();
const pool = require('../../db/init');
const verifyToken = require('../auth/token');

module.exports = (app) => {
    router.route('/bg/:science_id')
        .get(async (req, res) => {
            let items = await pool.query(`SELECT * FROM branch_group WHERE science_id='${req.params.science_id}'`);
            items.rows.push({notification: {isError: !items.rowCount, message: !items.rowCount && "Произошла ошибка"}});
            await res.json(items.rows)
        })
        .post(verifyToken, async (req, res) => {
            try {
                let items = await pool.query(`INSERT INTO branch_group VALUES ('${req.body.bg_id}', '${req.body.name}', '${req.body.science_id}')`);
                console.log(items);
                await res.json({notification: {isError: false, message: `Группа специальностей ${req.body.bg_id} успешно создана`}})
            } catch (err) {
                await res.json({notification: {isError: true, message: err.code === '23505' ? `Группа специальностей ${req.body.bg_id} уже существует` : "Произошла ошибка"}})
            }
        });
    router.route('/bg/edit/:bg_id')
        .get(verifyToken, async (req, res) => {
            await res.json({notification: {isError: false, message: false}})
        })
        .put(verifyToken, async (req, res) => {
            let items = await pool.query(`UPDATE branch_group SET (bg_id, name, science_id) = ('${req.body.bg_id}', '${req.body.name}', '${req.body.science_id}') WHERE bg_id='${req.params.bg_id}'`);
            await res.json({notification: {isError: !items.rowCount, message: items.rowCount ? `Группа специальностей ${req.params.bg_id} успешно изменена` : "Произошла ошибка"}})
        })
        .delete(verifyToken, async (req, res) => {
            let items = await pool.query(`DELETE FROM branch_group WHERE bg_id='${req.params.bg_id}'`);
            await res.json({notification: {isError: !items.rowCount, message: items.rowCount ? `Группа специальностей ${req.params.bg_id} успешно удалена` : "Произошла ошибка"}})
        });
    app.use(
        router
    );
};