import express from 'express';
import apicache from 'apicache';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';
import colors from 'colors';
import { expressjwt } from 'express-jwt';
import routes from './src/router/index.js';
import { secret, port } from './src/conf/index.js';

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
app.use(express.static(path.join(__dirname, 'static')));

app.use(expressjwt({
    secret,  // 签名的密钥 或 PublicKey
    algorithms: ['HS256'],
    // getToken: function fromHeaderOrQuerystring(req) {
    //     if (req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer') {
    //         return req.headers.token.split(' ')[1];
    //     }
    //     return null;
    // }
}).unless({
    path: ['/login', '/loadImg']  // 指定路径不经过 Token 解析
}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ state: 0, data: 'invalid token' });
    } else {
        next();
    }

});

// 约定路由文件夹
routes(app, path.join(__dirname, './src/modules'));

app.server = app.listen(port, () => {
    console.log(`server running @ http://localhost:${port}`);
});

export default app;
