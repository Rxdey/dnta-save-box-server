import path from 'path';
import select from '../db/query.js';
import { createThumbnail, thumbnailExtname } from '../utils/image.js';

/**
 * 生成全部缩略图
 * query.force 强制生成，覆盖源文件
 * @returns 
 */
const thumbnail = async ({ query, cookies }, { sendErrorResponse, sendSuccessResponse }) => {
    try {
        const { force } = query;
        const record = await select.find({
            database: 'favorite',
            where: { type: 'img' }
        });
        const tempList = record.filter(item => thumbnailExtname.includes(path.extname(item.path)));

        for (const i in tempList) {
            await createThumbnail(tempList[i].path, !!force);
        }
        return sendSuccessResponse({ data: 1 });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default thumbnail;