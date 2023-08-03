/** 项目端口 */
export const port = process.env.SYSTEM_PORT;

/** 项目地址 */
export const SYSTEM_URL = `${process.env.SYSTEM_HOST}:${port}`

/** jwt字符串 */
export const secret = 'DNTA';

/** db配置 */
export const DB_CONFIG = {
    // 主机名称
    host: process.env.DB_HOST,
    // host: '45.76.203.52',
    // host: '127.0.0.1',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: 'root',
    // 数据库名
    database: 'dnta',
    timezone: '08:00',
    multipleStatements: true
};

/** 静态目录 */

export const STATIC_PATH = './download';
export const IMAGE_PATH = `${STATIC_PATH}/image`;
export const UPLOAD_PATH = `${STATIC_PATH}/upload`;
export const THUMBNAIL_PATH = `${STATIC_PATH}/image/thumbnail`;

export const REPLACE_PATH = url => url.search(UPLOAD_PATH) > -1 ? UPLOAD_PATH : IMAGE_PATH;

export const VIDEO_PATH = `${STATIC_PATH}/video`;
export const VIDEO_SOURCE = `${VIDEO_PATH}/source`;
export const VIDEO_RESULT = `${VIDEO_PATH}/result`;