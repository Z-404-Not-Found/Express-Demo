const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const createError = require("http-errors");

const userService = {
    register: async (account, username, role, avatar, password) => {
        if (!account || !username || !role || !avatar || !password) {
            throw createError(400, { message: "参数错误" });
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        if (await userModel.findUser(account)) {
            throw createError(409, { message: "用户已存在" });
        }
        return userModel.addUser(account, username, role, avatar, hashPassword);
    },
    login: async (account, password) => {
        if (!account || !password) {
            throw createError(400, { message: "参数错误" });
        }
        const user = await userModel.findUser(account);
        if (!user) {
            throw createError(404, { message: "用户不存在" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw createError(401, { message: "密码错误" });
        }
        return user;
    },
    getUser: async (account, username, role, page = 1, size = 10) => {
        const limit = size || 10;
        const offset = (page - 1) * limit;
        const data = await userModel.getUser(
            account,
            username,
            role,
            limit,
            offset
        );
        if (!data) {
            throw createError(404, { message: "用户不存在" });
        }
        return data;
    },
    updateUserByAccount: async (account, username, avatar) => {
        if (!account || !username || !avatar) {
            throw createError(400, { message: "参数错误" });
        }
        return userModel.updateUserByAccount(account, username, avatar);
    },
    deleteUserByAccount: async (account) => {
        if (!account) {
            throw createError(400, { message: "参数错误" });
        }
        return userModel.deleteUserByAccount(account);
    },
    changePassword: async (account, oldPassword, newPassword) => {
        if (!account || !oldPassword || !newPassword) {
            throw createError(400, { message: "参数错误" });
        }
        const user = await userModel.findUser(account);
        if (!user) {
            throw createError(404, { message: "用户不存在" });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw createError(401, { message: "原密码错误" });
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(newPassword, salt);
        return userModel.setPasswordByAccount(account, hashPassword);
    },
    resetPassword: async (account) => {
        if (!account) {
            throw createError(400, { message: "参数错误" });
        }
        const user = await userModel.findUser(account);
        if (!user) {
            throw createError(404, { message: "用户不存在" });
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash("123456", salt);
        return userModel.setPasswordByAccount(account, hashPassword);
    },
};

module.exports = userService;
