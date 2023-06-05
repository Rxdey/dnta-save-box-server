import axios from 'axios';
import iconv from 'iconv-lite';
import colors from 'colors';

const request = async ({
    url = '',
    headers = {},
    method = 'GET',
    type = ''
}, data = {}) => {
    console.log(url);
    const setting = {
        url,
        method,
        data,
        timeout: 100000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
            ...headers
        }
    };
    // 某些页面编码需要转换，先不管它
    if (type === 'arraybuffer') {
        setting.responseType = 'arraybuffer';
        setting.transformResponse = [function (data) {
            const str = iconv.decode(Buffer.from(data), 'utf8');
            const html = iconv.encode(str, 'utf8').toString();
            return html;
        }];
    }
    try {
        const res = await axios(setting);
        return res.data;
    } catch (error) {
        console.log(colors.red(error))
        return '';
    }
};

export default request;