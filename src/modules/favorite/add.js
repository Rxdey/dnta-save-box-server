import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { dateformat } from '../../utils/index.js';
import select from '../../db/query.js';
import md5 from 'md5';

const __dirname = path.resolve();
const downloadImg = async (href = '', origin = '') => {
    if (!href) return;
    const uploadPath = `./download/image/${dateformat(new Date(), 'YYYY-MM-DD')}/`;
    try {
        const stats = fs.statSync(uploadPath);
        if (!stats || !stats.isDirectory()) {
            throw new Error('文件夹路径已被其他类型文件占用');
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            fs.mkdirSync(uploadPath);
        } else {
            throw error;
        }
    }
    const target_path = path.resolve(__dirname, uploadPath);
    const response = await axios.get(href, { responseType: 'stream', headers: {
        referer: origin
    } });
    const headers = response.headers;
    const contentType = headers['content-type'];
    const imgType = contentType.split('/')[1];
    const fileName = `${md5(dateformat())}.${imgType}`;
    await response.data.pipe(fs.createWriteStream(target_path + '/' + fileName));
    return uploadPath + fileName;
};
/**
 * 添加收藏
 */
const add = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const typeList = ['img', 'url', 'text'];
    const { tid, type, content, origin, title, desc_txt, preview_img } = body;
    if (!typeList.includes(type)) return sendErrorResponse({ msg: '添加失败，错误的类型' });
    // 防止图片失效，图片存储本地
    let pathUrl = null;
    console.log(type);
    if (type === 'img') {
        if (typeof content !== 'string') return sendErrorResponse({ msg: '添加失败' });
        pathUrl = await downloadImg(content, origin);
        console.log(pathUrl);
        if (!pathUrl) return sendErrorResponse({ msg: '添加到本地失败' });
    }
    try {
        const setData = {
            uid, tid, type, content, origin, title, desc_txt, preview_img, path: pathUrl, create_date: dateformat(), update_date: dateformat()
        };
        await select.insert({
            database: 'favorite',
            set: setData
        });
        return sendSuccessResponse({ msg: '已添加', data: 1 });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '添加失败' });
    }
};

export default add;