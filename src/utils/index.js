
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { secret } from '../conf/index.js';

export const dateformat = (date = '', format = 'YYYY-MM-DD HH:mm:ss') => {
    return moment(date || new Date()).format(format);
};

export const createToken = ({ id, userName }) => {
    const token = 'Bearer ' + jwt.sign(
        {
            id,
            userName
        },
        secret,
        {
            expiresIn: 3600 * 24 * 7
        }
    );
    return token;
};

export const cleanObj = (obj) => {
    return Object.keys(obj).reduce((p, n) => {
        if (obj[n] || obj[n] === 0 || obj[n] === false) p[n] = obj[n];
        return p;
    }, {})
}