import { dateformat } from '../utils/index.js';
import select from '../db/query.js';

/**
 * 根据state查询记录 
 * state为0时查询所有
 * @returns 
 */
const getAnimateList = async (req, { sendErrorResponse, sendSuccessResponse }) => {
    const { query, auth } = req;
    const { id: userId } = auth;
    const { source, pageSize = 30, pageNo = 1, state } = query;
    if (!source) return sendErrorResponse({ msg: '参数错误' });
    const start = (parseInt(pageNo) - 1) * parseInt(pageSize);
    const end = ((parseInt(pageNo) - 1) * parseInt(pageSize)) + parseInt(pageSize);
    try {
        const where = { userId, isShow: 1 };
        if (parseInt(state) !== -1) where['state'] = state;
        // 查询订阅记录
        const record = await select.find({
            database: 'collection',
            where,
            limit: {
                start,
                end
            },
            order: { type: 'DESC', key: 'updateDate' }
        });
        return sendSuccessResponse({ data: record });
    } catch (error) {
        console.log(error)
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default getAnimateList;