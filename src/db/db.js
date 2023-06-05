import mysql from 'mysql';
import { DB_CONFIG } from '../conf/index.js';

const pool = mysql.createPool(DB_CONFIG);

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      connection.query(sql, params, (err, result) => {
        //释放连接
        // pool.releaseConnection(connection)
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
      //这么设置，能够解决卡死问题
      connection.release();
    });
  });
};

export default {
  query
}