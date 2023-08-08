import path from 'path';
import multer from 'multer';
import { dateformat } from '../../utils/index.js';
import { createThumbnail } from '../../utils/image.js';
import select from '../../db/query.js';
import { VIDEO_TEMP_PATH } from '../../conf/index.js';

const __dirname = path.resolve();

function getEx(filePath) {
    return filePath.split('.')[filePath.split('.').length - 1];
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, path.resolve(VIDEO_TEMP_PATH));
    },
    filename(req, file, cb) {
        cb(null, Date.now() + '.' + getEx(file.originalname));
    }
});
const upload = multer({ storage });


/**
 * 视频转gif
 * @returns 
 */
const video2gif = ({ app, sendErrorResponse, sendSuccessResponse }) => {
    app.post('/video/video2gif', upload.single('file'), async (req, res) => {
        console.log(req.file);
    });
};
export default {
    type: 'ignore',
    fnc: video2gif
};