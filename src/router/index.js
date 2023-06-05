import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();

const sendErrorResponse = ({ msg = '请求失败', data, state = 0, success = false, ...reset }) => {
    return { msg, data, state, success, ...reset };
};
/**
 * 
 * @param success 1 无异常且操作成功 0 无异常但是操作失败
 * @returns 
 */
const sendSuccessResponse = ({ msg = '请求成功', data, state = 1, success = true, ...reset }) => {
    return { msg, data, state, success, ...reset };
};

const routes = (app, baseDir, currentDir = '') => {
    if (!baseDir || !app) return;
    if (!currentDir) currentDir = baseDir;
    fs.readdirSync(baseDir).reverse().forEach(file => {
        // 获取子文件/文件夹
        const childFile = path.join(baseDir, file);
        const isFile = fs.statSync(childFile).isFile();
        // 如果是文件夹，递归
        if (!isFile) {
            routes(app, childFile, currentDir);
            return;
        }
        // 非js文件不处理
        if (!(/\.js$/i.test(file))) return;
        // const baseDirReplace = currentDir.replace(__dirname, '');
        const routePath = childFile.replace(currentDir, '').replace(/\.js$/i, '').replace(/\\/g, '/');
        console.log(routePath);
        import(`file://${childFile}`).then(fnc => {
            if (typeof fnc.default !== 'function') return;
            app.use(routePath, async (request, response) => {
                try {
                    const res = await fnc.default(request, { sendErrorResponse, sendSuccessResponse });
                    if (routePath === '/loadImg') {
                        if (!res) {
                            response.status(500);
                            response.send({ state: 0, msg: '服务器异常' });
                            return;
                        }
                        response.set({
                            ...response.headers,
                            'content-type': 'image/jpeg'
                        });
                        response.end(res, 'binary');
                        return;
                    }
                    if (!res) {
                        response.send({ state: 0, msg: '请求失败' });
                        return;
                    }
                    response.send(res);
                } catch (error) {
                    console.log(error);
                    response.status(500);
                    response.send({ state: 0, msg: '服务器异常' });
                }
            });
        });
    });
};

export default routes;