import { dateformat, cleanObj } from '../../utils/index.js';
import select from '../../db/query.js';

const update = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const { id, index, name, desc_txt, color, nsfw } = body;
    if (!id) return sendErrorResponse({ msg: '参数错误' });
    const sets = {
        index,
        name,
        desc_txt,
        color,
        nsfw,
        update_date: dateformat()
    };
    try {
        // 更新数据，返回更新条数
        const record = await select.update({
            database: 'tag',
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