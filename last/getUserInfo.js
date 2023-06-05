// import md5 from 'md5';
import select from '../db/query.js';
import { createToken } from '../utils/index.js';

const getUserInfo = async ({ auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id } = auth;
    try {
        const record = await select.find({
            database: 'user',
            field: 'userName,nickName,phone,sex,email,createDate,headImg,id,birthDay',
            where: {
                id
            }
        });
        if (!record.length) return sendErrorResponse({ msg: '未查询到用户' });
        return sendSuccessResponse({ data: record[0] });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default getUserInfo;