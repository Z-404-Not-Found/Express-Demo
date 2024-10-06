const userService = require("../services/userService");
const successHandler = require("../middleware/successHandler");
const jwtUtils = require("../utils/jwt");

const userController = {
    register: async (req, res, next) => {
        const { account, username, role, avatar, password } = req.body;
        await userService
            .register(account, username, role, avatar, password)
            .then(() => {
                successHandler(res, "注册成功");
            })
            .catch((err) => {
                next(err);
            });
    },
    login: async (req, res, next) => {
        const { account, password } = req.body;
        await userService
            .login(account, password)
            .then((data) => {
                const token = jwtUtils.generateToken({
                    account: data.account,
                    role: data.role,
                });
                successHandler(res, "登录成功", {
                    ...data,
                    token: "Bearer " + token,
                    password: undefined,
                });
            })
            .catch((err) => {
                next(err);
            });
    },
    getUser: async (req, res, next) => {
        const { account, username, role, page, size } = req.query;

        await userService
            .getUser(account, username, role, page, size)
            .then((data) => {
                successHandler(res, "成功", {
                    ...data,
                    user: data.user.map((user) => {
                        return {
                            ...user,
                            password: undefined,
                        };
                    }),
                });
            })
            .catch((err) => {
                next(err);
            });
    },
    updateUserByAccount: async (req, res, next) => {
        const { account, username, avatar } = req.body;
        await userService
            .updateUserByAccount(account, username, avatar)
            .then(() => {
                successHandler(res, "更新成功");
            })
            .catch((err) => {
                next(err);
            });
    },
    deleteUserByAccount: async (req, res, next) => {
        const { account } = req.query;
        await userService
            .deleteUserByAccount(account)
            .then(() => {
                successHandler(res, "删除成功");
            })
            .catch((err) => {
                next(err);
            });
    },
    changePassword: async (req, res, next) => {
        const { account, oldPassword, newPassword } = req.body;
        await userService
            .changePassword(account, oldPassword, newPassword)
            .then(() => {
                successHandler(res, "修改密码成功");
            })
            .catch((err) => {
                next(err);
            });
    },
    resetPassword: async (req, res, next) => {
        const { account } = req.body;
        await userService
            .resetPassword(account)
            .then(() => {
                successHandler(res, "已将密码重置为123456");
            })
            .catch((err) => {
                next(err);
            });
    },
};

module.exports = userController;
