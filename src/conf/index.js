/** 项目端口 */
export const port = process.env.SYSTEM_PORT;

/** 项目地址 */
// export const SYSTEM_URL = `${process.env.SYSTEM_HOST}:${port}`;
export const SYSTEM_URL = process.env.SYSTEM_URL;

/** jwt字符串 */
export const secret = 'DNTA';

/** db配置 */
export const DB_CONFIG = {
    // 主机名称
    host: process.env.DB_HOST,
    // 端口号
    port: process.env.DB_PORT,
    // 用户名
    user: process.env.DB_USER,
    // 密码
    password: process.env.DB_PASSWORD,
    // 数据库名
    database: process.env.DB_DATABASE,
    timezone: '08:00',
    multipleStatements: true
};

/** 静态目录 */

export const STATIC_PATH = './download';
/** 图片保存目录 */
export const IMAGE_PATH = `${STATIC_PATH}/image`;
/** 本地图片引入目录 */
export const UPLOAD_PATH = `${STATIC_PATH}/upload`;
/** 缩略图目录 */
export const THUMBNAIL_PATH = `${STATIC_PATH}/image/thumbnail`;
/** 上传图片目录 */
export const UPLOAD_IMAGE_PATH = `${STATIC_PATH}/image/upload`;


/** 因目录规划错误部分需替换 */
export const REPLACE_PATH = url => url.search(UPLOAD_PATH) > -1 ? UPLOAD_PATH : IMAGE_PATH;

/** 视频目录 */
export const VIDEO_PATH = `${STATIC_PATH}/video`;
/** 视频源目录 */
export const VIDEO_SOURCE = `${VIDEO_PATH}/source`;
/** 视频缩略图及移动后目录 */
export const VIDEO_RESULT = `${VIDEO_PATH}/result`;
/** 视频临时目录 */
export const VIDEO_TEMP_PATH =`${STATIC_PATH}/TEMP`