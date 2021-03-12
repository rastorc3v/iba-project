const router = require('express').Router();
const pool = require('../../db/init');
const verifyToken = require('../auth/token');

module.exports = (app) => {
    router.route('/science')
        .get(async (req, res) => {
            let items = await pool.query(`SELECT * FROM science`);
            items.rows.push({notification: {isError: !items.rowCount, message: !items.rowCount && "Произошла ошибка"}});
            await res.json(items.rows)
        })
        .post(verifyToken, async (req, res) => {
            try {
                let items = await pool.query(`INSERT INTO science VALUES ('${req.body.science_id}', '${req.body.name}')`);
                await res.json({notification: {isError: false, message: `Научная отрасль ${req.body.science_id} успешно создана`}})
            } catch (err) {
                await res.json({notification: {isError: true, message: err.code === '23505' ? `Научная отрасль ${req.body.science_id} уже существует` : "Произошла ошибка"}})
            }
        });
    router.route('/science/:science_id')
        .put(verifyToken, async (req, res) => {
            let items = await pool.query(`UPDATE science SET (science_id, name) = ('${req.body.science_id}', '${req.body.name}') WHERE science_id='${req.params.science_id}'`);
            await res.json({notification: {isError: !items.rowCount, message: items.rowCount ? `Научная отрасль ${req.params.science_id} успешно изменена` : "Произошла ошибка"}})
        })
        .delete(verifyToken, async (req, res) => {
            let items = await pool.query(`DELETE FROM science WHERE science_id='${req.params.science_id}'`);
            await res.json({notification: {isError: !items.rowCount, message: items.rowCount ? `Научная отрасль ${req.params.science_id} успешно удалена` : "Произошла ошибка"}})
        });
    app.use(
        router
    );
};