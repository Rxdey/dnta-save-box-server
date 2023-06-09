import { dateformat, cleanObj } from '../../utils/index.js';
import select from '../../db/query.js';

const getAllFavorite = async ({ query, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const { page = 1, pageSize = 50, tid = null, is_show = 1, nsfw = 0, type, order = 'DESC' } = query;

    // 分页查询
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = ((parseInt(page) - 1) * parseInt(pageSize)) + parseInt(pageSize);
    try {
        const where = cleanObj({ uid, is_show, tid, nsfw, type });
        const totle = await select.count({
            database: 'favorite',
            where
        });

        const record = await select.find({
            database: 'favorite',
            where,
            limit: {
                start,
                end
            },
            order: { type: order, key: 'create_date' }
        });
        return sendSuccessResponse({ data: { list: record, totle, page, pageSize } });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default getAllFavorite;