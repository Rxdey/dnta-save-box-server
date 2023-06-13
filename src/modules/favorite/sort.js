import { dateformat, cleanObj } from '../../utils/index.js';
import select from '../../db/query.js';

const sort = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const { id, targetId, position } = body;
    if (!id || !targetId || (!position && position !== 0)) return sendErrorResponse({ msg: '更新失败，参数错误' });

    try {
        const targetRows = await select.find({
            database: 'favorite',
            where: { id: targetId },
        });
        if (!targetRows.length) return sendErrorResponse({ msg: '更新失败，未查询到目标' });
        const { sort } = targetRows[0];
        console.log(sort);
        // // 更新数据，返回更新条数
        const record = await select.update({
            database: 'favorite',
            set: cleanObj({
                sort: position ? sort + 1 : sort - 1
            }),
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

export default sort;