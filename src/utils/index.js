import moment from 'moment';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { secret } from '../conf/index.js';

export const dateformat = (date = '', format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(date || new Date()).format(format);
};
/** 创建token */
export const createToken = ({ id, userName }) => {
    const token =
        'Bearer ' +
        jwt.sign(
            {
                id,
                userName,
            },
            secret,
            {
                expiresIn: 3600 * 24 * 7,
            }
        );
    return token;
};
/** 清理对象 */
export const cleanObj = obj => {
    return Object.keys(obj).reduce((p, n) => {
        if (obj[n] || obj[n] === 0 || obj[n] === false) p[n] = obj[n];
        return p;
    }, {});
};
/** 判断文件/文件夹是否存在 */
export const isExists = (filePath = '') => {
    return new Promise(resolve => {
        if (!filePath) {
            resolve(false);
            return;
        }
        fs.access(filePath, fs.constants.F_OK, err => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
};
/** 判断是否存在，并且不存在就创建文件夹 */
export const createDirectoryIfNotExists = async (directoryPath = '') => {
    const exists = await isExists(directoryPath);
    if (!exists) {
        fs.mkdirSync(directoryPath);
    }
};
/** 移动文件 */
export const moveFile = (sourcePath, targetPath) => fs.renameSync(sourcePath, targetPath);
/** 获取文件名 */
export const getFileNameWithoutExtension = filePath => {
    const { name } = path.parse(filePath);
    return name;
};

function transposeArray(array) {
    const rows = array.length;
    const columns = array[array.length - 1].length;
    const transposedArray = [];
    for (let j = 0; j < columns; j++) {
        transposedArray[j] = [];
        for (let i = 0; i < rows; i++) {
           if(array[i][j]) transposedArray[j][i] = array[i][j];
        }
    }
    return transposedArray;
}

export const routesTable = (arr = []) => {
    const routers = arr.reduce((p, n) => {
        const c = n.split('/').filter(item => item);
        const key = c.length <= 1 ? '/' : c[0];
        let i = p.findIndex(item => item.key === key);
        if (i <= -1) {
            p.push({ key, list: [] });
            i = p.length - 1;
        }
        p[i].list.push(n);
        return p;
    }, []).sort((a, b) => a.list.length - b.list.length).map(item => item.list);
    return transposeArray(routers);
};
