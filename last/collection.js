import { dateformat } from '../src/utils/index.js';
import select from '../src/db/query.js';

/**
 * 添加/取消收藏
 * state 0 未收藏 1 已收藏 9不存在就加入历史，存在就不管
 */
const collection = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: userId } = auth;
    console.log(body);
    const { source, animateId, animateName, cover, state } = body;
    if (!source || !animateId || (!state&&state !== 0)) return sendErrorResponse({ msg: '参数错误' });
    try {
        // 查询订阅记录
        const record = await select.find({
            database: 'collection',
            where: {
                userId,
                animateId,
                source,
            }
        });
        console.log(record.length)
        // 不存在记录
        if (!record.length) {
            const setData = {
                userId,
                animateId,
                source,
                cover,
                animateName,
                state: parseInt(state),
                createDate: dateformat(),
                updateDate: dateformat()
            };
            if (parseInt(state) === 9) setData.state = 0;
            await select.insert({
                database: 'collection',
                set: setData
            });
            return sendSuccessResponse({ msg: '已订阅1', data: state });
        }
        // 更新订阅
        if (record.length) {
            if (parseInt(state) === 0 && parseInt(record[0].state) === 0) return sendSuccessResponse({ msg: '已订阅2', data: state });
            if (parseInt(state) === 9) return sendSuccessResponse({ msg: '已订阅2', data: state });
            if (parseInt(state) === 1 && parseInt(record[0].state) === 1) return sendSuccessResponse({ msg: '已订阅2', data: state });
            await select.update({
                database: 'collection',
                set: {
                    cover,
                    animateName,
                    state,
                    updateDate: dateformat(),
                },
                where: {
                    userId,
                    animateId,
                    source
                }
            });
            return sendSuccessResponse({ msg: !state ? '已取消' : '已订阅3', data: state });
        }
    } catch (error) {
        console.log(error)
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default collection;