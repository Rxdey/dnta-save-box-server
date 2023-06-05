import { dateformat, cleanObj } from '../../utils/index.js';
import select from '../../db/query.js';

const update = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const typeList = ['img', 'url', 'text'];
    const { id, tid, type, content, origin, title, desc_txt, preview_img, download = true } = body;
    if (!id) return sendErrorResponse({ msg: '更新失败，未查询到ID' });
    if (!typeList.includes(type)) return sendErrorResponse({ msg: '更新失败，错误的类型' });
    const sets = {
        tid, type, content, origin, title, desc_txt, preview_img, update_date: dateformat()
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
        return sendSuccessResponse({ data: record, msg: record ? '更新成功' : '未查询到数据' });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '更新失败' });
    }
};

export default update;