const productHelper = require('../helper/productHelper')

class productController {

  static async fetchProducts(req, res) {
    try {
      const products = await productHelper.getProducts(req, res)
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error while fetching products' });

    }
  }


  static async updateTags(req, res) {
    try {
      const result = await productHelper.bulkUpdateSegment(req);
      return res.status(200).json(result);
    } catch (error) {
      console.error('updateSegment error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async getCoverageData(req, res) {
    try {
      const result = await productHelper.getCoverage(req);
      console.log(result, "result")
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in getting coverage data:', error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = productController