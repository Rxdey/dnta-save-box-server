import express from 'express';
import './src/conf/env.js';
import apicache from 'apicache';
import bodyParser from 'body-parser';
import path from 'path';
import colors from 'colors';
import cors from 'cors';
import { expressjwt } from 'express-jwt';
import routes from './src/router/index.js';
import { secret, port, SYSTEM_URL } from './src/conf/index.js';
import { routesTable } from './src/utils/index.js';

console.log(colors.red('当前环境: ' + process.env.NODE_ENV));
// 指定路径不经过 Token 解析
const excludePaths = ['/login', '/loadImg', '/video/get', '/video/getCover', '/favorite/upload', '/thumbnail'];

const __dirname = path.resolve();
const app = express();

const cache = apicache.options({
    headers: {
        'cache-control': 'no-cache'
    }
}).middleware;

// CORS
app.use(cors());
app.use((req, res, next) => {
    res.header({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
    });
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cache('15 minutes', ((req, res) => res.statusCode === 200 || res.statusCode === 304)));
app.use(express.static(path.join(__dirname, 'download')));

app.use(expressjwt({
    secret,  // 签名的密钥 或 PublicKey
    algorithms: ['HS256'],
}).unless({ path: excludePaths }));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ state: 0, data: 'invalid token' });
    } else {
        next();
    }

});

// 约定路由文件夹
const routeList = routes(app, path.join(__dirname, './src/modules'));
console.table(routesTable(routeList).reverse());

app.server = app.listen(port, () => {
    console.log(colors.green(`server running @${SYSTEM_URL}`));
});

export default app;
