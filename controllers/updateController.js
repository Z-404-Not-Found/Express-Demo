const Minio = require("minio");
const successHandler = require("../middleware/successHandler");
const createError = require("http-errors");

const updateController = {
    checkUpdate: async (req, res, next) => {
        try {
            const minioClient = new Minio.Client({
                endPoint: process.env.MINIO_ENDPOINT,
                port: parseInt(process.env.MINIO_PORT, 10),
                accessKey: process.env.MINIO_ACCESS_KEY,
                secretKey: process.env.MINIO_SECRET_KEY,
                useSSL: false,
            });

            const bucketName = "express-demo-apk";
            await minioClient.bucketExists(bucketName).then(async (exists) => {
                if (!exists) {
                    await minioClient.makeBucket(bucketName);
                }
            });
            const stream = minioClient.listObjectsV2(bucketName, "", true);

            let latestVersion = null;
            let latestFile = null;

            stream.on("data", (obj) => {
                const versionMatch = obj.name.match(/(\d+\.\d+\.\d+)\.apk$/);
                if (versionMatch) {
                    const version = versionMatch[1];
                    if (!latestVersion || version > latestVersion) {
                        latestVersion = version;
                        latestFile = obj.name;
                    }
                }
            });

            stream.on("end", () => {
                if (latestVersion && latestFile) {
                    const downloadUrl = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${latestFile}`;
                    successHandler(res, "最新版本信息", {
                        version: latestVersion,
                        downloadUrl: downloadUrl,
                    });
                } else {
                    next(createError(400, { message: "未找到更新" }));
                }
            });

            stream.on("error", (err) => {
                next(err);
            });
        } catch (err) {
            next(err);
        }
    },
};

module.exports = updateController;
