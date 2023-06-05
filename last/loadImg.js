import request from '../utils/request.js';
import axios from 'axios';

const loadImg = async ({ query }, { sendErrorResponse, sendSuccessResponse }) => {
    const { url } = query;
    if (!url) return sendErrorResponse({ msg: '参数错误' });
    try {
        const imgPath = decodeURIComponent(url);

        const res = await axios({
            url: encodeURI(imgPath),
            method: 'get',
            headers: {
                referer: 'https://www.maofly.com/',
                'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
            },
            responseType: 'arraybuffer',
        })
        return res.data.toString('binary');
    } catch (error) {
        console.log(error);
        return null;
    }
};

export default loadImg;