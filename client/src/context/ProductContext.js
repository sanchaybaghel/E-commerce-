import { createContext, useContext, useState } from 'react';
import { getProducts, searchProducts } from '../api/product';

const ProductContext = createContext();

export function useProduct() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add state for filters and pagination
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const fetchProducts = async (customFilters = {}, customPage = 1) => {
    setLoading(true);
    const params = { ...customFilters, page: customPage };
    const res = await searchProducts(params);
    setProducts(res.data.products);
    setFilters(customFilters);
    setPage(customPage);
    setLoading(false);
  };

  const search = async (keyword) => {
    fetchProducts({ keyword });
  };

  // For changing filters (e.g., category, price)
  const applyFilters = (newFilters) => {
    fetchProducts(newFilters, 1);
  };

  // For pagination
  const goToPage = (pageNum) => {
    fetchProducts(filters, pageNum);
  };

  return (
    <ProductContext.Provider value={{
      products, loading, fetchProducts, search, filters, applyFilters, page, goToPage
    }}>
      {children}
    </ProductContext.Provider>
  );
}