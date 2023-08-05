import path from 'path';
import multer from 'multer';
import { dateformat } from '../../utils/index.js';
import { createThumbnail } from '../../utils/image.js';
import select from '../../db/query.js';
import { UPLOAD_IMAGE_PATH, THUMBNAIL_PATH } from '../../conf/index.js';

const __dirname = path.resolve();

function getEx(filePath) {
    return filePath.split('.')[filePath.split('.').length - 1];
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.resolve(UPLOAD_IMAGE_PATH));
    },
    filename(req, file, cb) {
        cb(null, Date.now() + '.' + getEx(file.originalname));
    }
});
const upload = multer({ storage });


/**
 * 获取本地图片
 * http://localhost:7052/favorite/upload?name=pic&tid=25&uid=1
 * @returns 
 */
const uploadImage = ({ app, sendErrorResponse, sendSuccessResponse }) => {

    app.post('/favorite/uploadImage', upload.single('file'), async (req, res) => {
        const { id: uid } = req.auth;
        if (!uid) {
            res.send(sendErrorResponse({ msg: '参数错误' }));
            return;
        }
        const url = `${UPLOAD_IMAGE_PATH}/${req.file.filename}`;
        const setData = {
            uid,
            tid: 0,
            type: 'img',
            content: url,
            origin: 'http://localhost',
            title: url,
            path: url,
            create_date: dateformat(),
            update_date: dateformat()
        };
        try {
            console.log(req.file);
            createThumbnail(req.file.path, false, `${path.resolve(THUMBNAIL_PATH)}/upload/${req.file.filename}`);

            const insertId = await select.insert({
                database: 'favorite',
                set: setData
            });
            const count = await select.count({
                field: 'id',
                database: 'favorite',
                where: {
                    uid
                }
            });
            await select.update({
                database: 'favorite',
                set: {
                    sort: count * 100
                },
                where: {
                    uid,
                    id: insertId
                },
                count: false
            });
            res.send(sendSuccessResponse({ msg: '上传成功' }));
        } catch (error) {
            res.send(sendErrorResponse({ msg: '上传失败' }));
        }
    });
};
/**
 * const { id: uid } = auth;
    if (!uid) return sendErrorResponse({ msg: '参数错误' });

    return sendSuccessResponse({ data: 1 });
 */
export default {
    type: 'ignore',
    fnc: uploadImage
};