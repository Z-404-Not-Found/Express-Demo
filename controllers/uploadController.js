const successHandler = require("../middleware/successHandler");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const createError = require("http-errors");
const Minio = require("minio");

const uploadController = {
    uploadImageToBed: async (req, res, next) => {
        if (!req.file) {
            next(createError(400, { message: "请上传图片" }));
        } else {
            const image = req.file.path;
            const formData = new FormData();
            formData.append("file", fs.createReadStream(image));
            axios
                .post(process.env.IMAGE_BED_API_URL, formData, {
                    headers: {
                        Authorization:
                            process.env.IMAGE_BED_API_TOKEN.toString(),
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    },
                })
                .then((response) => {
                    fs.unlinkSync(image);
                    successHandler(res, "图片上传成功", {
                        imageUrl: response.data.data.links.url,
                        thumbUrl: response.data.data.links.thumbnail_url,
                        imageKey: response.data.data.key,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    },
    uploadImageToMinIO: async (req, res, next) => {
        if (!req.file) {
            next(createError(400, { message: "请上传图片" }));
        } else {
            const image = req.file.path;
            const minioClient = new Minio.Client({
                endPoint: process.env.MINIO_ENDPOINT,
                port: parseInt(process.env.MINIO_PORT, 10),
                accessKey: process.env.MINIO_ACCESS_KEY,
                secretKey: process.env.MINIO_SECRET_KEY,
                useSSL: false,
            });
            const bucketName = "express-demo-image-bed";
            await minioClient.bucketExists(bucketName).then(async (exists) => {
                if (!exists) {
                    await minioClient.makeBucket(bucketName);
                }
            });
            const objectName = req.file.filename;
            const metaData = {
                "Content-Type": req.file.mimetype,
            };
            await minioClient.putObject(
                bucketName,
                objectName,
                fs.createReadStream(image),
                metaData,
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );
            fs.unlinkSync(image);
            successHandler(res, "图片上传成功", {
                imageUrl: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${objectName}`,
            });
        }
    },
};

module.exports = uploadController;
