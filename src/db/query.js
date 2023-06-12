import db from './db.js';
import colors from 'colors';
const select = {};

const parseWhereObject = (where = {}) => Object.keys(where).reduce((prve, current, index, arr) => {
  prve += `${current}='${where[current]}' `;
  if (index !== arr.length - 1) prve += 'and ';
  return prve;
}, '');

const orderObject = (order = {}) => `${order.key} ${order.type}`;

const parseOrder = (order = {}) => {
  if (Array.isArray(order)) {
    return order.reduce((p, n) => {
      p += p ? `, ${orderObject(n)}` : orderObject(n);
      return p;
    }, '');
  } else {
    return orderObject(order);
  }
}

select.count = ({
  field = '*',
  database = 'manhua_user',
  where = {}
}) => {
  const condition = parseWhereObject(where);
  const sql = `select count(${field}) from ${database} where ${condition}`;
  console.log(colors.bgMagenta(sql));
  return new Promise((resolve, reject) => {
    db.query(sql, (error, results, fields) => {
      if (error) {
        reject(false);
        return;
      }
      const counts = JSON.parse(JSON.stringify(results[0]));
      resolve(counts[fields[0].name]);
    });
  });
};

select.find = ({
  field = '*',
  database = 'manhua_user',
  where = {},
  limit = {
    start: 0,
    end: 0
  },
  order = { type: 'ASC', key: 'id' }
}) => {
  const condition = parseWhereObject(where);
  const orderStr = parseOrder(order);
  const sql = `select ${field} from ${database} where ${condition}ORDER BY ${orderStr}${limit.end ? ` LIMIT ${limit.start},${limit.end}` : ''}`;
  console.log(colors.bgMagenta(sql));
  return new Promise((resolve, reject) => {
    db.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(results);
    });
  });
};

select.insert = ({
  database = 'manhua_user',
  set = {}
}) => {
  if (!set || JSON.stringify(set) === '{}') {
    reject('不能为空');
    return;
  }
  const keys = Object.keys(set).filter(item => set[item]);
  const values = keys.reduce((prve, current, index) => {
    const val = set[current];
    prve += typeof set[current] === 'string' ? `'${val}'` : val;
    if (index !== keys.length - 1) prve += ',';
    return prve;
  }, '');

  const sql = `insert into ${database} (${keys.join(',')}) values(${values})`;
  console.log(colors.bgMagenta(sql));
  return new Promise((resolve, reject) => {
    db.query(sql, (error, results, fields) => {
      if (error) {
        reject(false);
        console.log(error);
        return;
      }
      resolve(results.insertId);
    });
  });
};

select.update = ({
  database = 'tag',
  where = {},
  set = {}
}) => {

  const condition = parseWhereObject(where);

  const values = Object.keys(set).reduce((prve, current, index, arr) => {
    prve += `${current}='${set[current]}' `;
    if (index !== arr.length - 1) prve += ', ';
    return prve;
  }, '');
  const sql = `update ${database} set ${values} where ${condition}`;
  console.log(colors.bgMagenta(sql));

  return new Promise((resolve, reject) => {
    select.count({
      database,
      where: where
    }).then(res => {
      // console.log(res);
      if (res) {
        db.query(sql, (error, results, fields) => {
          if (error) {
            reject(false);
            console.log(error);
            return;
          }
          resolve(results.changedRows);
        });
      } else {
        resolve(res);
      }
    });
  });

};

select.delete = ({
  database = 'tag',
  where = {},
}) => {
  const condition = parseWhereObject(where);
  const sql = `delete from ${database} where ${condition}`;
  console.log(colors.bgMagenta(sql));
  return new Promise((resolve, reject) => {
    db.query(sql, (error, results, fields) => {
      if (error) {
        reject(false);
        console.log(error);
        return;
      }
      resolve(results);
    });
  });

};

export default select;