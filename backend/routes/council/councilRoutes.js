const router = require('express').Router();
const pool = require('../../db/init');
const verifyToken = require('../auth/token');

const paginateBy = 20;

module.exports = (app) => {
    router.route('/councils')
        .get(async (req, res) => {
            let search = req.query.search ? req.query.search : "";
            let offset = req.query.page ? req.query.page * paginateBy - paginateBy : 0;
            let items = await pool.query(`Select cb.council_id, array_agg(branch_id) as branches, o.name organization, c.creation_date, c.expiration_date, phone from council_branch cb inner join council c on c.council_id = cb.council_id inner join organization o on c.org_id = o.org_id WHERE c.council_id LIKE '%${search}%' OR o.name LIKE '%${search}%' OR cb.branch_id LIKE '%${search}%' OR c.creation_date::text LIKE '%${search}%' OR c.expiration_date::text LIKE '%${search}%' OR c.phone LIKE '%${search}%' group by cb.council_id, c.creation_date, c.expiration_date, c.phone, o.name, c.council_id ORDER BY c.council_id OFFSET ${offset} LIMIT ${paginateBy}`);
            let count = await pool.query(`Select cb.council_id, array_agg(branch_id) as branches, o.name organization, c.creation_date, c.expiration_date, phone from council_branch cb inner join council c on c.council_id = cb.council_id inner join organization o on c.org_id = o.org_id WHERE c.council_id LIKE '%${search}%' OR o.name LIKE '%${search}%' OR cb.branch_id LIKE '%${search}%' OR c.creation_date::text LIKE '%${search}%' OR c.expiration_date::text LIKE '%${search}%' OR c.phone LIKE '%${search}%' group by cb.council_id, c.creation_date, c.expiration_date, c.phone, o.name, c.council_id`);
            items.rows.push({count: count.rowCount}, {notification: {isError: false, message: false}});
            await res.json(items.rows);
        })
        .post(verifyToken, async (req, res) => {
            //get organization
            let org_id = await pool.query(`SELECT org_id FROM organization WHERE name='${req.body.org_name}'`);
            if (!org_id.rowCount) {
                return res.json({notification: {isError: true, message: "Указанной организации не сущесвует"}})
            }
            org_id = org_id.rows[0].org_id;

            // create council
            try {
                await pool.query(`INSERT INTO council VALUES (
                '${req.body.council_id}',
                '${req.body.creation_date}',
                '${req.body.expiration_date}',
                '${org_id}',
                '${req.body.phone}')`);
            } catch (err) {
                return await res.json({notification: {isError: true, message: err.code === '23505' ? "Совет с таким шифром уже сущесвует" : "Произошла ошибка"}})
            }
            // create record in council_branch table to associate council to branches
            let branches = req.body.branch_id.split(', ');
            try {
                for (let i = 0; i < branches.length; i++) {
                    await pool.query(`INSERT INTO council_branch VALUES ('${req.body.council_id}', '${branches[i]}')`)
                }
            } catch (err) {
                await pool.query(`DELETE FROM council WHERE council_id='${req.body.council_id}'`);
                return await res.json({notification: {isError: true, message: err.code === '23503' ? "Указаны некорректные специальности" : "Произошла ошибка"}})
            }
            await res.json({notification: {isError: false, message: `Совет успешно создан`}})
        });
    router.route('/councils/:council_id')
        .get(isCouncilExist, async (req, res) => {
            let items = await pool.query(`SELECT council.council_id, json_agg(b.name) as branches_string, council.creation_date, council.expiration_date, o.name as organization, council.phone FROM council INNER JOIN council_branch cb USING (council_id) INNER JOIN organization o USING (org_id) INNER JOIN branch b USING (branch_id) WHERE council.council_id='${req.params.council_id}' GROUP BY council.council_id, o.name`);
            items.rows.push({notification: {isError: false, message: false}});
            await res.json(items.rows)
        })
        .put(verifyToken, isCouncilExist, async (req, res) => {
            //get organization
            let org_id = await pool.query(`SELECT org_id FROM organization WHERE name='${req.body.org_name}'`);
            if (!org_id.rowCount) {
                return res.json({notification: {isError: true, message: "Указанной организации не сущесвует"}})
            }
            org_id = org_id.rows[0].org_id;

            // put data
            try {
                await pool.query(`UPDATE council SET (council_id, creation_date, expiration_date, org_id, phone) = (
                    '${req.body.council_id}',
                    '${req.body.creation_date}',
                    '${req.body.expiration_date}',
                    '${org_id}',
                    '${req.body.phone}') WHERE council_id='${req.params.council_id}'`);
                await res.json({notification: {isError: false, message: `Совет ${req.params.council_id} успешно изменён`}})
            } catch (err) {
                return await res.json({notification: {isError: true, message: err.code === '23505' ? "Совет с таким шифром уже сущесвует" : "Произошла ошибка" + err}})
            }
        })
        .delete(verifyToken, isCouncilExist, async (req, res) => {
            try {
                let item = await pool.query(`DELETE FROM council WHERE council_id='${req.params.council_id}'`);
                if (item.rowCount) {
                    await res.json({notification: {isError: false, message: `Совет ${req.params.council_id} успешно удалён`}})
                } else {
                    await res.json({notification: {isError: true, message: `Совет ${req.params.council_id} не существует`}})
                }
            } catch (err) {
                await res.json({notification: {isError: true, message: `Произошла ошибка (${err.code})`}})
            }
        });
    app.use(
        router
    );
};

async function isCouncilExist (req, res, next) {
    let item = await pool.query(`SELECT * FROM council WHERE council_id='${req.params.council_id}'`);
    if (!item.rowCount) {
        return await res.json({notification: {isError: true, message: `Совет ${req.params.council_id} не существует`}})
    }
    await next();
}
