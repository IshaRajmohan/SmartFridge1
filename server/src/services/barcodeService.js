import axios from 'axios';

const lookup = async (barcode) => {
  try {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    const res = await axios.get(url);
    if (res.data && res.data.status === 1) {
      const p = res.data.product;
      return { name: p.product_name || p.generic_name, image: p.image_small_url, categories: p.categories };
    }
    return {};
  } catch (err) {
    return {};
  }
};

export default { lookup };
