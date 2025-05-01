const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');
const fs = require('fs');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM celestial_body');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function insertStar(cb_name, coordinate, visible, distance, diameter, temperature, spectral_class, luminosity_class, color, age) {
    return await withOracleDB(async (connection) => {
        const cb = "INSERT INTO celestial_body (cb_name, coordinate, visible, distance, diameter) VALUES (:1, :2, :3, :4, :5)";
        const star1 = "INSERT INTO star1 (temperature, spectral_class, luminosity_class, color) VALUES (:1, :2, :3, :4)";
        const star = "INSERT INTO star (cb_name, coordinate, age, temperature) VALUES (:1, :2, :3, :4)";

        let result;
        let error = 0;
        try {
            result = await connection.execute(
                cb,
                [cb_name, coordinate, visible, distance, diameter],
                { autoCommit: true }
            );
        } catch {
            error++;
            throw new Error("celestial_body insert failed");
        }
        try {
            result = await connection.execute(
                star1,
                [temperature, spectral_class, luminosity_class, color],
                { autoCommit: true }
            )
        } catch {
            error++;
            await connection.execute('DELETE FROM celestial_body WHERE cb_name = :1 AND coordinate = :2', [cb_name, coordinate],{ autoCommit: true });
            throw new Error("star1 insert failed");
        }
        try {
            result = await connection.execute(
                star,
                [cb_name, coordinate, age, temperature],
                { autoCommit: true }
            )
        } catch {
            await connection.execute('DELETE FROM celestial_body WHERE cb_name = :1 AND coordinate = :2', [cb_name, coordinate],{ autoCommit: true });
            await connection.execute('DELETE FROM star1 WHERE temperature = :1', [temperature],{ autoCommit: true });
            error++;
            throw new Error("Star insert failed");
        }

        if (error == 3) {
            throw new Error("All inserts failed!");
        }

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertObservatory(obs_name, obs_id, obs_address) {
    return await withOracleDB(async (connection) => {
        const obs1 = "INSERT INTO Observatory1 (obs_name, address) VALUES (:1, :2)";
        const obs = "INSERT INTO Observatory (obs_id, obs_name) VALUES (:1, :2)";

        let result;
        let error = 0;
        try {
            result = await connection.execute(
                obs1,
                [obs_name, obs_address],
                { autoCommit: true }
            );
        } catch {
            error++;
            throw new Error("Observator1 Insert failed");
        }
        try {
            result = await connection.execute(
                obs,
                [obs_id, obs_name],
                { autoCommit: true }
            )
        } catch {
            error++;
            await connection.execute('DELETE FROM Observatory1 WHERE obs_name = :1', [obs_name],{ autoCommit: true });
            throw new Error("Observatory insert failed");
        }

        if (error == 2) {
            throw new Error("All inserts failed!");
        }

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertTelescope(tel_name, obs_id, manufactured_date, model) {
    return await withOracleDB(async (connection) => {
        const tel1 = "INSERT INTO tel_housed_at1 (tel_name, obs_id) VALUES (:1, :2)";
        const tel = "INSERT INTO tel_housed_at (tel_name, manufactured_date, model) VALUES (:1, TO_DATE(:2, 'YYYY/MM/DD'), :3)";

        let result;
        let error = 0;
        try {
            result = await connection.execute(
                tel1,
                [tel_name, obs_id],
                { autoCommit: true }
            );
        } catch {
            error++;
            throw new Error("tel_housed_at1 insert failed");
        }
        try {
            result = await connection.execute(
                tel,
                [tel_name, manufactured_date, model],
                { autoCommit: true }
            )
        } catch {
            await connection.execute('DELETE FROM tel_housed_at1 WHERE tel_name = :1', [tel_name],{ autoCommit: true });
            throw new Error("Some insert was invalid");
        }

        if (error == 1) {
            throw new Error("All inserts failed!");
        }

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertPicture(picture_id, date, link, tel_name, cb_name, coordinate) {
    return await withOracleDB(async (connection) => {
        const pic1 = "INSERT INTO picture_taken_by(picture_id, date_taken, link, tel_name) VALUES (:1, TO_DATE(:2, 'YYYY/MM/DD'), :3, :4)";
        const pic = "INSERT INTO taken_of(picture_id, cb_name, coordinate) VALUES (:1, :2, :3)";

        let result;
        let error = 0;
        try {
            result = await connection.execute(
                pic1,
                [picture_id, date, link, tel_name],
                { autoCommit: true }
            );
        } catch {
            error++;
            throw new Error("picture_taken_by Insert invalid");
        }
        try {
            result = await connection.execute(
                pic,
                [picture_id, cb_name, coordinate],
                { autoCommit: true }
            )
        } catch {
            error++;
            await connection.execute('DELETE FROM picture_taken_by WHERE picture_id = :1', [picture_id], { autoCommit: true });
            throw new Error("taken_of Insert invalid");
        }

        if (error == 2) {
            throw new Error("All inserts failed!");
        }

        return true;
    }).catch(() => {
        return false;
    });
}

async function deleteCelestialBody(cb_name, coordinate) {
    return await withOracleDB(async (connection) => {
        const sql = `DELETE FROM celestial_body WHERE cb_name = :cb_name AND coordinate = :coordinate`;
        const binds = { cb_name: cb_name, coordinate: coordinate };

        const result = await connection.execute(
            sql,
            binds,
            { autoCommit: true }
        );

        return true;
    }).catch(() => {
        return false;
    });
}

async function updateCelestialBody(cb_name, coordinate, updateData) {
    return await withOracleDB(async (connection) => {
        let needsCommit = false;

        const celestialUpdates = [];
        const celestialBinds = { cb_name, coordinate };

        ['visible', 'distance', 'diameter'].forEach(field => {
            if (updateData[field] !== undefined) {
                celestialUpdates.push(`${field} = :${field}`);
                celestialBinds[field] = updateData[field];
            }
        });

        if (celestialUpdates.length > 0) {
            const sql = `UPDATE celestial_body SET ${celestialUpdates.join(', ')} WHERE cb_name = :cb_name AND coordinate = :coordinate`;
            await connection.execute(sql, celestialBinds, { autoCommit: false });
            needsCommit = true;
        }

        const starFields = ['age', 'temperature'];
        const starUpdates = {};
        starFields.forEach(field => {
            if (updateData[field] !== undefined) starUpdates[field] = updateData[field];
        });

        const star1Fields = ['spectral_class', 'luminosity_class', 'color'];
        const star1Updates = {};
        star1Fields.forEach(field => {
            if (updateData[field] !== undefined) star1Updates[field] = updateData[field];
        });

        if (Object.keys(starUpdates).length > 0 || Object.keys(star1Updates).length > 0) {
            const { rows } = await connection.execute(
                'SELECT temperature FROM Star WHERE cb_name = :cb_name AND coordinate = :coordinate',
                { cb_name, coordinate },
                { autoCommit: false }
            );

            if (!rows.length) throw new Error('Star not found');
            const currentTemp = rows[0].TEMPERATURE;
            const newTemp = (starUpdates.temperature != null) ? starUpdates.temperature : currentTemp;
            const tempChanged = starUpdates.temperature !== undefined && starUpdates.temperature !== currentTemp;

            if (tempChanged || Object.keys(star1Updates).length > 0) {
                const targetTemp = tempChanged ? newTemp : currentTemp;

                if (tempChanged) {
                    const { rows } = await connection.execute(
                        'SELECT 1 FROM Star1 WHERE temperature = :temperature',
                        { temperature: newTemp },
                        { autoCommit: false }
                    );

                    if (!rows.length) {
                        await connection.execute(
                            `INSERT INTO Star1 (temperature, spectral_class, luminosity_class, color) VALUES (:temperature, :sc, :lc, :col)`,
                            {
                                temperature: newTemp,
                                sc: star1Updates.spectral_class != null ? star1Updates.spectral_class : null,
                                lc: star1Updates.luminosity_class != null ? star1Updates.luminosity_class : null,
                                col: star1Updates.color != null ? star1Updates.color : null
                            },
                            { autoCommit: false }
                        );
                        needsCommit = true;
                    }
                }

                if (Object.keys(star1Updates).length > 0) {
                    const setClauses = [];
                    const binds = { temperature: targetTemp };

                    star1Fields.forEach(field => {
                        if (star1Updates[field] !== undefined) {
                            setClauses.push(`${field} = COALESCE(:${field}, ${field})`);
                            binds[field] = star1Updates[field];
                        }
                    });

                    if (setClauses.length > 0) {
                        await connection.execute(
                            `UPDATE Star1 SET ${setClauses.join(', ')} 
                                 WHERE temperature = :temperature`,
                            binds,
                            { autoCommit: false }
                        );
                        needsCommit = true;
                    }
                }
            }

            const starSet = [];
            const starBinds = { cb_name, coordinate };

            if (starUpdates.age !== undefined) {
                starSet.push('age = :age');
                starBinds.age = starUpdates.age;
            }
            if (tempChanged) {
                starSet.push('temperature = :temperature');
                starBinds.temperature = newTemp;
            }

            if (starSet.length > 0) {
                await connection.execute(
                    `UPDATE Star SET ${starSet.join(', ')} 
                         WHERE cb_name = :cb_name AND coordinate = :coordinate`,
                    starBinds,
                    { autoCommit: false }
                );
                needsCommit = true;
            }
        }

        if (needsCommit) await connection.commit();
        return true;
    }).catch(error => {
        console.error(error);
        return false;
    });
}

async function getCelestialBodiesWithinDistance(distance) {
    return await withOracleDB(async (connection) => {
        const sql = 'SELECT * FROM celestial_body WHERE distance < :distance';
        const binds = { distance: distance };

        const result = await connection.execute(
            sql,
            binds,
            { autoCommit: true }
        );

        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchAstronomersAuthored(ast_id, th_name, ph_name, ast_name) {
    return await withOracleDB(async (connection) => {
        const selectedColumns = [];
        if (ast_id) selectedColumns.push('au.ast_id');
        if (th_name) selectedColumns.push('au.th_name');
        if (ph_name) selectedColumns.push('au.ph_name');
        if (ast_name) selectedColumns.push('ast.ast_name');

        const sql = `SELECT ${selectedColumns.join(', ')} FROM Authored au, Astronomer ast WHERE au.ast_id = ast.ast_id`;

        const result = await connection.execute(
            sql,
            {},
            { autoCommit: true }
        );

        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function searchObservatoriesTelecopes(tel_name) {
    return await withOracleDB(async (connection) => {
        const sql = `SELECT obs.obs_name FROM tel_housed_at1 th1, observatory obs WHERE th1.tel_name = :tel_name AND th1.obs_id = obs.obs_id`;
        const binds = { tel_name: tel_name };

        const result = await connection.execute(
            sql,
            binds,
            { autoCommit: true }
        );

        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function hardCodedQueries(num) {
    return await withOracleDB(async (connection) => {
        const queries = [
            `SELECT obs.obs_id, obs.obs_name, cb.cb_name, cb.distance FROM celestial_body cb, taken_of to1, tel_housed_at1 th1, observatory obs, picture_taken_by ptb WHERE to1.cb_name = cb.cb_name AND to1.picture_id = ptb.picture_id AND ptb.tel_name = th1.tel_name AND th1.obs_id = obs.obs_id AND cb.distance = (SELECT MAX(cb.distance) FROM celestial_body cb, taken_of to1, tel_housed_at1 th1, observatory obs2, picture_taken_by ptb WHERE to1.cb_name = cb.cb_name AND to1.picture_id = ptb.picture_id AND ptb.tel_name = th1.tel_name AND th1.obs_id = obs.obs_id AND obs2.obs_name = obs.obs_name GROUP BY obs2.obs_name)`,
            `SELECT th1.obs_id, MIN(manufactured_date) FROM tel_housed_at th, tel_housed_at1 th1 WHERE th.tel_name = th1.tel_name GROUP BY th1.obs_id HAVING COUNT(*) >= 2`,
            `SELECT AVG(amount) as average FROM Temp`,
            `SELECT obs.obs_id, obs.obs_name FROM Observatory obs, Observatory1 obs1 WHERE obs.obs_name = obs1.obs_name AND NOT EXISTS ( SELECT cb_name  FROM celestial_body MINUS SELECT to1.cb_name FROM tel_housed_at1 th1, picture_taken_by ptb, taken_of to1 WHERE th1.obs_id = obs.obs_id AND th1.tel_name = ptb.tel_name AND ptb.picture_id = to1.picture_id)`
        ];

        if (num == 3) {
            const extra = `CREATE OR REPLACE VIEW Temp(obs_id, amount) as SELECT th1.obs_id, COUNT(*) AS amount FROM tel_housed_at1 th1, tel_housed_at tha, picture_taken_by ptb WHERE th1.tel_name = ptb.tel_name AND th1.tel_name = tha.tel_name GROUP BY th1.obs_id`;
            await connection.execute(
                extra,
                {},
                { autoCommit: true }
            );
        }

        const sql = queries[num];
        const binds = {};

        const result = await connection.execute(
            sql,
            binds,
            { autoCommit: true }
        );

        return result.rows;
    }).catch(() => {
        return [];
    });
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable,
    insertDemotable,
    updateNameDemotable,
    countDemotable,
    insertStar,
    insertObservatory,
    insertTelescope,
    insertPicture,
    deleteCelestialBody,
    updateCelestialBody,
    getCelestialBodiesWithinDistance,
    fetchAstronomersAuthored,
    searchObservatoriesTelecopes,
    hardCodedQueries
};
