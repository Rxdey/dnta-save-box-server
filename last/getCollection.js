import { dateformat } from '../utils/index.js';
import select from '../db/query.js';

const getCollection = async ({ query, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: userId } = auth;
    const { source, animateId } = query;
    if (!source || !animateId) return sendErrorResponse({ msg: '参数错误' });
    try {
        // 查询订阅记录
        const record = await select.find({
            database: 'collection',
            where: {
                userId,
                animateId,
                source
            },
        });
        return sendSuccessResponse({ data: record.length ? record[0] : null });
    } catch (error) {
        console.log(error)
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default getCollection;