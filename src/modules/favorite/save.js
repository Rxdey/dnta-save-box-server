import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { dateformat, cleanObj } from '../../utils/index.js';
import select from '../../db/query.js';
import md5 from 'md5';
import tunnel from 'tunnel';

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
    const response = await axios.get(href, {
        httpAgent: tunnel.httpOverHttp({ proxy: { host: '127.0.0.1', port: '10809' } }),
        httpsAgent: tunnel.httpsOverHttp({ proxy: { host: '127.0.0.1', port: '10809' } }),
        responseType: 'stream', headers: {
            referer: origin
        }
    });
    const headers = response.headers;
    const contentType = headers['content-type'];
    const imgType = contentType.split('/')[1];
    const fileName = `${md5(dateformat())}.${imgType}`;
    await response.data.pipe(fs.createWriteStream(target_path + '/' + fileName));
    return uploadPath + fileName;
};



/**
 * 保存
 */
const save = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const typeList = ['img', 'url', 'text'];
    const { id, tid, type, content, origin, title, desc_txt, preview_img, is_show, ...reset } = body;
    // 没有id 为添加
    if (!id) {
        if (!typeList.includes(type)) return sendErrorResponse({ msg: '操作失败，错误的类型【1】' });
        // 防止图片失效，图片存储本地
        let pathUrl = null;
        if (type === 'img') {
            pathUrl = await downloadImg(content, origin);
            if (!pathUrl) return sendErrorResponse({ msg: '已收藏，添加图片到本地失败' });
        }
        try {
            const setData = {
                uid, tid, type, content, origin, title, desc_txt, preview_img, path: pathUrl, create_date: dateformat(), update_date: dateformat()
            };
            const res = await select.insert({
                database: 'favorite',
                set: setData
            });
            const count = await select.count({
                field: 'id',
                database: 'favorite',
                where: {
                    uid
                }
            });
            console.log(count);
            await select.update({
                database: 'favorite',
                set: {
                    sort: count * 200
                },
                where: {
                    uid,
                    id: res
                },
            });
            return sendSuccessResponse({ msg: '已添加', data: res });
        } catch (error) {
            console.log(error);
            return sendErrorResponse({ msg: '添加失败' });
        }
    } else {
        if (type && !typeList.includes(type)) return sendErrorResponse({ msg: '操作失败，错误的类型【1】' });
        const sets = {
            tid, type, content, origin, title, desc_txt, preview_img, update_date: dateformat(), is_show
        };
        try {
            // 更新数据，返回更新条数
            const record = await select.update({
                database: 'favorite',
                set: cleanObj(sets),
                where: {
                    uid,
                    id
                },
            });
            return sendSuccessResponse({ data: record, msg: record ? '更新成功' : '未查询到数据', state: record ? 1 : 0 });
        } catch (error) {
            console.log(error);
            return sendErrorResponse({ msg: '更新失败' });
        }
    }
};

export default save;