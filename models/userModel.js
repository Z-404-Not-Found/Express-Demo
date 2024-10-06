const db = require("../config/dbConfig");

const userModel = {
    addUser: (account, username, role, avatar, password) => {
        return db.execute(
            `INSERT INTO users (account, username, role, avatar, password) VALUES (?, ?, ?, ?, ?)`,
            [account, username, role, avatar, password]
        );
    },
    findUser: (account) => {
        return db
            .execute(`SELECT * FROM users WHERE account = ?`, [account])
            .then((result) => result[0][0]);
    },
    getUser: async (account, username, role, limit, offset) => {
        let where = "";
        let params = [];
        if (account) {
            where += "account = ?";
            params.push(account);
        }
        if (username) {
            if (where) {
                where += " AND username LIKE ?";
            } else {
                where += "username LIKE ?";
            }
            params.push(`%${username}%`);
        }
        if (role) {
            if (where) {
                where += " AND role = ?";
            } else {
                where += "role = ?";
            }
        }
        if (!where) {
            where = "1=1";
        }
        const user = await db
            .execute(`SELECT * FROM users WHERE ${where} LIMIT ? OFFSET ?`, [
                ...params,
                limit.toString(),
                offset.toString(),
            ])
            .then((result) => result[0]);
        const count = await db
            .execute(
                `SELECT COUNT(*) as count FROM users WHERE ${where}`,
                params
            )
            .then((result) => result[0][0].count);

        return { user, count };
    },
    updateUserByAccount: (account, username, avatar) => {
        return db.execute(
            `UPDATE users SET username = ?, avatar = ? WHERE account = ?`,
            [username, avatar, account]
        );
    },
    setPasswordByAccount: (account, password) => {
        return db.execute(`UPDATE users SET password = ? WHERE account = ?`, [
            password,
            account,
        ]);
    },
    deleteUserByAccount: (account) => {
        return db.execute(`DELETE FROM users WHERE account = ?`, [account]);
    },
};

module.exports = userModel;
