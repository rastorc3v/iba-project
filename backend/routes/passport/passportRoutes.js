const router = require('express').Router();
const pool = require('../../db/init');
const verifyToken = require('../auth/token');

module.exports = (app) => {
    router.route('/passport')
        .post(verifyToken, async (req, res) => {
            //create new passport
            try {
                await pool.query(`INSERT INTO b_passport(branch_id, definition, research, differentiation) VALUES ('${req.body.branch_id}', '${req.body.definition}', '${req.body.research}', '${req.body.differentiation}')`);
            } catch (err) {
                console.log('error');
                console.log(err);
                return await res.json({notification: {isError: true, message: "Произошла ошибка"}})
            }

            //get id of new passport
            let b_passport_id;
            try {
                b_passport_id = await pool.query(`SELECT max(b_passport_id) FROM b_passport`);
                b_passport_id = b_passport_id.rows[0].max;
            } catch (err) {

            }

            //create relates for this passport
            let branches = req.body.branches.split(',');
            console.log(branches)
             try {
                for (let i = 0; i < branches.length; i++) {
                    await pool.query(`INSERT INTO b_passport_branch VALUES ('${b_passport_id}', '${branches[i]}')`)
                }
            } catch (err) {
                 await pool.query(`DELETE FROM b_passport WHERE b_passport_id='${b_passport_id}'`);
                 return await res.json({notification: {isError: true, message: err.code === '23503' ? "Указаны некорректные специальности" : "Произошла ошибка"}})
             }
            await res.json({ notification: { isError: false, message: `Паспорт успешно создан`}})
        })
        .get(async (req, res) => {
            let items = await pool.query(`SELECT b_passport_id, b_passport.branch_id, json_agg(pb.branch_id) as close_branches, definition, research, definition FROM b_passport INNER JOIN b_passport_branch pb USING (b_passport_id) group by b_passport_id, b_passport.branch_id, definition, research, definition`);
            await res.json(items.rows)
        });
    router.route('/passport/:passport_id')
        .get(async (req, res) => {
            let items = await pool.query(`SELECT b_passport_id, b_passport.branch_id, json_agg(pb.branch_id) as close_branches, definition, research, definition FROM b_passport INNER JOIN b_passport_branch pb USING (b_passport_id) WHERE b_passport_id='${req.params.passport_id}' group by b_passport_id, b_passport.branch_id, definition, research, definition`);
            items.rows.push({notification: {isError: false, message: false}});
            await res.json(items.rows)
        })
        .delete(verifyToken, async (req, res) => {
            let items = await pool.query(`DELETE FROM b_passport WHERE b_passport_id='${req.params.passport_id}'`);
            await res.json({notification: {isError: !items.rowCount, message: items.rowCount ? `Паспорт ${req.params.passport_id} успешно удален` : "Произошла ошибка"}})
        });
    app.use(
        router
    );
};