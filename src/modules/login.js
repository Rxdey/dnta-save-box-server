// import md5 from 'md5';
import select from '../db/query.js';
import { createToken } from '../utils/index.js';

const login = async ({ body, cookies }, { sendErrorResponse, sendSuccessResponse }) => {
    try {
        const { userName, password } = body;
        if (!userName || !password) return sendErrorResponse({ msg: '参数错误' });
        const record = await select.find({
            database: 'user',
            field: 'user_name,nick_name,create_date,avatar,id',
            where: {
                'user_name': userName,
                'password': password
            }
        });
        if (!record.length) return sendErrorResponse({ msg: '账号密码不正确' });
        const token = createToken({ userName, id: record[0].id });
        return sendSuccessResponse({ data: { ...record[0] }, token });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default login;