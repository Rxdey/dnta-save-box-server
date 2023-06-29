import path from 'path';
import { dateformat } from '../../utils/index.js';
import { getAllFile } from '../../utils/video.js';
import select from '../../db/query.js';
import { UPLOAD_PATH } from '../../conf/index.js';

const __dirname = path.resolve();

function replaceFileExtension(filePath, newExtension) {
    const regex = /\.[^.]+$/; // 匹配最后一个点号及其后面的所有字符
    const newFilePath = filePath.replace(regex, `.${newExtension}`);
    return newFilePath;
  }
/**
 * 获取本地图片
 * @returns 
 */
const upload = async ({ query, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    // const { id: uid } = auth;
    const { name = '', tid, uid} = query;
    if (!tid || !uid) return sendErrorResponse({ msg: '参数错误' });
    const dir = path.resolve(__dirname, `${UPLOAD_PATH}/${name}`);
    const res = getAllFile(dir, '', [], false);
    if (res.length) {
        for (let data of res) {
            const url =`${UPLOAD_PATH}/${name}${data}`;
            const insertId = await select.insert({
                database: 'favorite',
                set: {
                    tid,
                    uid,
                    type: 'img',
                    content: url,
                    origin: 'http://localhost',
                    title: url,
                    path: url,
                    create_date: dateformat(),
                    update_date: dateformat()
                }
            });
            const count = await select.count({
                field: 'id',
                database: 'favorite',
                where: {
                    uid
                }
            });
            await select.update({
                database: 'favorite',
                set: {
                    sort: count * 100
                },
                where: {
                    uid,
                    id: insertId
                },
                count: false
            });
        }
    }
    return sendSuccessResponse({ data: { list: res } });
};

export default upload;