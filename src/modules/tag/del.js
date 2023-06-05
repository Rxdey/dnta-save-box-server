import { dateformat, cleanObj } from '../../utils/index.js';
import select from '../../db/query.js';

const del = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const { id } = body;
    if (!id) return sendErrorResponse({ msg: '参数错误' });
    try {
        // 删除标签
        const record = await select.del({
            database: 'tag',
            where: {
                uid,
                id
            },
        });
        // 清空对应收藏的tid
        await select.update({
            database: 'favorite',
            set: { tid: '' },
            where: { tid: id }
        });
        return sendSuccessResponse({ data: record, msg: '删除成功' });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '删除失败' });
    }
};

export default del;