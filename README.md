# Express-Demo

> 注：本 README 由 ai 生成，经过微调后发布，不确保准确。（采用[code2prompt](https://github.com/mufeedvh/code2prompt/)项目将整个项目代码转换为提示词）

## 项目简介

`express-demo` 是一个基于 Node.js 和 Express 框架的演示项目，包含了用户注册、登录、图片上传和版本检查等功能。后端使用 MySQL 作为数据库，MinIO 作为对象存储。主要功能模块包括用户管理、图片上传和应用更新检查。

## 注意事项

-   请确保 `.env` 文件中的环境变量配置正确，以保证数据库、MinIO、图床等服务正常运行。
-   demo 中使用的图床为 `Lsky Pro`，其他图床请根据接口文档自行修改相应参数。
-   检查更新的 apk 文件上传需手动上传到 `MinIO` 相应的 bucket （默认桶名 apk）中，文件名如`1.0.0.apk`。

## 默认用户名密码

管理员：

> -   账号：admin
> -   密码：admin

用户：

> -   账号：user
> -   密码：user

## 项目结构

项目架构为 MVC 架构。

```
express-demo
├── app.js
├── bin
│   └── www
├── config
│   └── dbConfig.js
├── controllers
│   ├── updateController.js
│   ├── uploadController.js
│   └── userController.js
├── middleware
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── successHandler.js
├── models
│   └── userModel.js
├── package.json
├── routes
│   ├── updateRoutes.js
│   ├── uploadRouters.js
│   └── userRoutes.js
├── services
│   └── userService.js
├── uploads
└── utils
    └── jwt.js
```

## 安装与运行

1.  克隆项目代码：
    ```sh
    git clone https://github.com/Z-404-Not-Found/Express-Demo.git
    ```
2.  安装依赖：

    ```sh
    cd express-demo
    yarn (or) npm install
    ```

3.  配置环境变量：创建 `.env` 文件，添加以下变量并替换为实际值：

    ```env
    NODE_ENV=development
    PORT=3000
    DB_HOST=your_database_host
    DB_PORT=your_database_port
    DB_USERNAME=your_database_username
    DB_PASSWORD=your_database_password
    DB_DATABASE=your_database_name
    MINIO_ENDPOINT=your_minio_endpoint
    MINIO_PORT=your_minio_port
    MINIO_ACCESS_KEY=your_minio_access_key
    MINIO_SECRET_KEY=your_minio_secret_key
    IMAGE_BED_API_URL=your_image_bed_api_url
    IMAGE_BED_API_TOKEN=your_image_bed_api_token
    JWT_SECRET=your_jwt_secret
    DEBUG=express-demo:server
    ```

4.  启动项目：

    ```sh
    npm run start
    ```

    开发模式下（自动重载）：

    ```sh
    npm run start_dev
    ```

5.  访问接口

服务默认运行在 `http://localhost:3000`

## 中间件说明

-   `authMiddleware.js`：用户身份认证和权限验证中间件。

-   `errorHandler.js`：全局错误处理器，用于处理应用中的错误并返回响应。

-   `successHandler.js`：统一的成功响应处理。

## 返回示例

### 错误处理

全局错误处理通过 `middleware/errorHandler.js` 实现，当请求出现错误时，会返回如下格式的错误信息：

-   **示例**:
    ```json
    {
        "status": 400,
        "message": "参数错误"
    }
    ```

### 成功处理

成功响应通过 `middleware/successHandler.js` 实现，当请求成功时，会返回如下格式的响应信息：

-   **示例**:
    ```json
    {
      "status": 200,
      "message": "操作成功",
      "data": { ... }
    }
    ```

## 接口文档

### 用户接口

#### 1. 用户注册

-   **URL**: `/api/users/register`
-   **方法**: POST
-   **权限**: 公开
-   **参数**:

    | 参数名   | 类型   | 必填 | 描述     |
    | -------- | ------ | ---- | -------- |
    | account  | String | 是   | 用户账号 |
    | username | String | 是   | 用户名   |
    | role     | String | 是   | 用户角色 |
    | avatar   | String | 是   | 头像链接 |
    | password | String | 是   | 用户密码 |

-   **响应示例**:
    ```json
    {
        "status": 200,
        "message": "注册成功"
    }
    ```

#### 2. 用户登录

-   **URL**: `/api/users/login`
-   **方法**: POST
-   **权限**: 公开
-   **参数**:

    | 参数名   | 类型   | 必填 | 描述     |
    | -------- | ------ | ---- | -------- |
    | account  | String | 是   | 用户账号 |
    | password | String | 是   | 用户密码 |

-   **响应示例**:
    ```json
    {
        "status": 200,
        "message": "登录成功",
        "data": {
            "account": "test_account",
            "role": "user",
            "avatar": "imgUrl",
            "token": "jwt_token"
        }
    }
    ```

#### 3. 获取用户信息

-   **URL**: `/api/users/getUser`
-   **方法**: GET
-   **权限**: 管理员
-   **参数**:

    | 参数名   | 类型   | 必填 | 描述              |
    | -------- | ------ | ---- | ----------------- |
    | account  | String | 否   | 用户账号          |
    | username | String | 否   | 用户名            |
    | role     | String | 否   | 用户角色          |
    | page     | Number | 否   | 页码，默认 1      |
    | size     | Number | 否   | 每页数量，默认 10 |

-   **响应示例**:
    ```json
    {
        "status": 200,
        "message": "成功",
        "data": {
            "user": [
                {
                    "account": "test_account",
                    "username": "Test User",
                    "role": "user",
                    "avatar": "imgUrl"
                }
            ],
            "count": 1
        }
    }
    ```

#### 4. 更新用户信息

-   **URL**: `/api/users/updateUser`
-   **方法**: PUT
-   **权限**: 管理员，用户
-   **参数**:

    | 参数名   | 类型   | 必填 | 描述     |
    | -------- | ------ | ---- | -------- |
    | account  | String | 是   | 用户账号 |
    | username | String | 是   | 用户名   |
    | avatar   | String | 是   | 头像链接 |

-   **响应示例**:
    ```json
    {
        "status": 200,
        "message": "更新成功"
    }
    ```

#### 5. 删除用户

-   **URL**: `/api/users/deleteUser`
-   **方法**: DELETE
-   **权限**: 管理员
-   **参数**:

    | 参数名  | 类型   | 必填 | 描述     |
    | ------- | ------ | ---- | -------- |
    | account | String | 是   | 用户账号 |

-   **响应示例**:
    ```json
    {
        "status": 200,
        "message": "删除成功"
    }
    ```

#### 6. 修改密码

-   **URL**: `/api/users/changePassword`
-   **方法**: PUT
-   **权限**: 管理员，用户
-   **参数**:

    | 参数名      | 类型   | 必填 | 描述     |
    | ----------- | ------ | ---- | -------- |
    | account     | String | 是   | 用户账号 |
    | oldPassword | String | 是   | 原密码   |
    | newPassword | String | 是   | 新密码   |

-   **响应示例**:
    ```json
    {
        "status": 200,
        "message": "修改密码成功"
    }
    ```

#### 7. 重置密码

-   **URL**: `/api/users/resetPassword`
-   **方法**: PUT
-   **权限**: 管理员
-   **参数**:

    | 参数名  | 类型   | 必填 | 描述     |
    | ------- | ------ | ---- | -------- |
    | account | String | 是   | 用户账号 |

-   **响应示例**:
    ```json
    {
        "status": 200,
        "message": "已将密码重置为123456"
    }
    ```

### 图片上传接口

#### 1. 上传图片到图床

-   **URL**: `/api/upload/uploadImageToBed`
-   **方法**: POST
-   **权限**: 公开
-   **参数**: 上传文件 `image`

-   **响应示例**:
    ```json
    {
        "status": 200,
        "message": "图片上传成功",
        "data": {
            "imageUrl": "https://image.bed/url",
            "thumbUrl": "https://image.bed/thumbnail_url",
            "imageKey": "image_key"
        }
    }
    ```

#### 2. 上传图片到 MinIO

-   **URL**: `/api/upload/uploadImageToMinIO`
-   **方法**: POST
-   **权限**: 公开
-   **参数**: 上传文件 `image`

-   **响应示例**:
    ```json
    {
        "status": 200,
        "message": "图片上传成功",
        "data": {
            "imageUrl": "http://minio.endpoint:9000/express-demo-image-bed/image.jpg"
        }
    }
    ```

### 更新检查接口

#### 1. 检查 APK 更新

-   **URL**: `/api/update/checkUpdate`
-   **方法**: GET
-   **权限**: 公开

-   **响应示例**:
    ```json
    {
        "status": 200,
        "message": "最新版本信息",
        "data": {
            "version": "1.0.0",
            "downloadUrl": "http://minio.endpoint:9000/express-demo-apk/1.0.0.apk"
        }
    }
    ```

## 运行环境

-   Node.js 版本：16.x 或更高
-   MySQL 版本：5.7 或更高
-   MinIO 版本：RELEASE.2021-06-17T00-10-46Z 或更高

## 依赖模块

-   `express`：Web 框架
-   `mysql2`：用于连接 MySQL 数据库
-   `minio`：用于与 MinIO 客户端进行交互
-   `jsonwebtoken`：用于生成和验证 JWT
-   `multer`：用于处理文件上传
-   `axios`：用于与外部 API 进行交互

## License

本项目遵循 [MIT License](https://opensource.org/licenses/MIT) 开源协议。
