// server/helpers/productHelper.js
const dataStore = require('../dataStore');
const fs = require('fs');
const path = require('path');

class ProductHelper {
  static async getProducts(req) {
    try {
      const { operator, values } = req.query;

      const paramToColumn = {
        productName: 'Product_Name',
        brand: 'Brand',
        color: 'Color',
        material: 'Material',
        // groundTruth: 'Ground_Truth',
      };

      const filterKeys = Object.keys(req.query).filter(key => key !== 'operator' && key !== 'values');
      const filters = [];
      if (operator && values && filterKeys.length) {
        const vals = values.split(',').map(v => v.trim()).filter(v => v);
        filterKeys.forEach(paramKey => {
          const columnName = paramToColumn[paramKey];
          if (columnName) {
            filters.push({ column: columnName, operator, value: vals });
          }
        });
      }

      const stripS = str => str.endsWith('s') ? str.slice(0, -1) : str;
      const out = filters.length
        ? dataStore.products.filter(item =>
          filters.every(({ column, operator, value }) => {
            const cell = String(item[column] || '').toLowerCase();
            return value.some(rawVal => {
              const v = rawVal.toLowerCase();
              switch (operator) {
                case 'Equals':
                  return stripS(cell) === stripS(v);
                case 'Contains':
                  if (cell.includes(v) || v.includes(cell)) return true;
                  const c1 = stripS(cell), v1 = stripS(v);
                  return c1.includes(v1) || v1.includes(c1);
                case 'Starts With':
                  return cell.startsWith(v) || v.startsWith(cell);
                case 'Ends With':
                  return cell.endsWith(v) || v.endsWith(cell);
                default:
                  return false;
              }
            });
          })
        )
        : dataStore.products;

      return out;

    } catch (error) {
      console.error('getProducts error:', error);
      throw new Error('Internal Server Error');
    }
  }

  static async bulkUpdateSegment(req) {
    try {
      const { ids, segment } = req.query;

      if (!ids || !segment) {
        throw new Error('Missing ids or segment');
      }

      const idArray = ids.split(',').map(id => parseInt(id, 10)).filter(n => !isNaN(n));

      idArray.forEach(id => {
        const product = dataStore.products.find(p => p.UI_ID === id);
        if (product) {
          product.tags = [segment];
        }
      });

      const dataStorePath = path.join(__dirname, '../dataStore.js');
      const dataToWrite = `module.exports = { products: ${JSON.stringify(dataStore.products, null, 2)} };`;

      fs.writeFileSync(dataStorePath, dataToWrite, 'utf8');

      const updatedCount = idArray.length;
      return { success: true, updatedCount };

    } catch (error) {
      console.error('bulkUpdateSegment error:', error);
      throw new Error('Failed to update segment');
    }
  }

  static async getCoverage(req) {
    try {
      const all = dataStore.products;
      const total = all.length;
      const covered = all.filter(p => Array.isArray(p.tags) && p.tags.length > 0).length;
      return { total, covered };
    } catch (err) {
      console.error('getCoverage error:', err);
    }
  }

}

module.exports = ProductHelper;
