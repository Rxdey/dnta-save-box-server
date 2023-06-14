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
};

select.count = ({
  field = '*',
  database = 'manhua_user',
  where = null
}) => {
  const condition = where ? parseWhereObject(where) : null;
  const sql = `select count(${field}) from ${database}${condition ? ` where ${condition}` : ''}`;
  console.log(colors.bgMagenta(sql));
  return new Promise((resolve, reject) => {
    db.query(sql, (error, results, fields) => {
      if (error) {
        reject(error);
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
  whereIn = null, // in
  set = {},
  count = true
}) => {
  const condition = parseWhereObject(where);

  const values = Object.keys(set).reduce((prve, current, index, arr) => {
    prve += `${current}='${set[current]}' `;
    if (index !== arr.length - 1) prve += ', ';
    return prve;
  }, '');

  const inStr = whereIn ? `${whereIn.key} in (${whereIn.value.join(',')}) and ` : '';

  const sql = `update ${database} set ${values} where ${inStr}${condition}`;
  console.log(colors.bgMagenta(sql));

  return new Promise((resolve, reject) => {
    if (count) {
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
    } else {
      db.query(sql, (error, results, fields) => {
        if (error) {
          reject(false);
          console.log(error);
          return;
        }
        resolve(results.changedRows);
      });
    }
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

select.querySql = (sql = '') => {
  return new Promise((resolve, reject) => {
    if (!sql) {
      reject(false);
      return;
    }
    db.query(sql, function (err, results) {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
};
export default select;