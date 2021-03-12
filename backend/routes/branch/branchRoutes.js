const router = require('express').Router();
const pool = require('../../db/init');
const verifyToken = require('../auth/token');

module.exports = (app) => {
    router.route('/branches')
        // .get(async (req, res) => {
        //     let search = req.query.search ? req.query.search : "";
        //     let items = await pool.query(`SELECT  science_id, science_name, json_agg(b_groups.bg_name), json_agg(b_ids) as branch_ids, json_agg(b_names) as branch_names FROM (SELECT json_agg(b.name) as b_names, json_agg(b.branch_id) as b_ids, bg.name as bg_name, bg.science_id, s.name as science_name FROM branch b INNER JOIN branch_group bg USING (bg_id) INNER JOIN science s USING (science_id) WHERE b.name LIKE '%${search}%' OR b.branch_id LIKE '%${search}%' GROUP BY bg_id, bg.name, bg.science_id, science_name) as b_groups  GROUP BY science_id, science_name`);
        //     items.rows.push({notification: {isError: false, message: false}});
        //     await res.json(items.rows);
        // })
        .post(verifyToken, async (req, res) => {
            try {
                let items = await pool.query(`INSERT INTO branch VALUES ('${req.body.branch_id}', '${req.body.name}', '${req.body.bg_id}')`);
                await res.json({ notification: { isError: false, message: items.rowCount ? `Специальность ${req.body.branch_id} успешно создана` : "Произошла ошибка" }})
            } catch (err) {
                await res.json({notification: {isError: true, message: err.code === '23505' ? `Специальность ${req.body.branch_id} уже сущесвует` : "Произошла ошибка"}})
            }
        });
    router.route(/^\/branches\/(\d\d\.\d\d\.00)$/)
        .get(async (req, res) => {
            console.log(req.params);
            let items = await pool.query(`SELECT * FROM branch WHERE bg_id='${req.params[0]}'`);
            items.rows.push({notification: {isError: false, message: false}});
            await res.json(items.rows);
        });
    router.route('/branches/:branch_id')
        .get(async (req, res) => {
            let items = await pool.query(`SELECT bp.branch_id, name, definition, json_agg(bpb.branch_id) as close_branches, research, differentiation FROM branch INNER JOIN b_passport bp USING (branch_id) INNER JOIN b_passport_branch bpb USING (b_passport_id) WHERE bp.branch_id='${req.params.branch_id}' GROUP BY b_passport_id, name, bg_id, definition, research, differentiation`);
            items.rows.push({notification: {isError: false, message: false}});
            await res.json(items.rows)
        })
        .put(verifyToken, async (req, res) => {
            let items = await pool.query(`UPDATE branch SET (branch_id, name, bg_id) = ('${req.body.branch_id}', '${req.body.name}', '${req.body.bg_id}') WHERE branch_id='${req.params.branch_id}'`);
            await res.json({notification: {isError: !items.rowCount, message: items.rowCount ? `Специальность ${req.params.branch_id} успешно изменена` : "Произошла ошибка"}})
        })
        .delete(verifyToken, async (req, res) => {
            let items = await pool.query(`DELETE FROM branch WHERE branch_id='${req.params.branch_id}'`);
            await res.json({notification: {isError: !items.rowCount, message: items.rowCount ? `Специальность ${req.params.branch_id} успешно удалена` : "Произошла ошибка"}})
        });
    app.use(
        router
    );
};
