import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts, searchProducts } from '../api/product';

export const fetchProducts = createAsyncThunk('products/fetch', async () => {
  const res = await getProducts();
  return res.data;
});

export const searchProductsThunk = createAsyncThunk('products/search', async (keyword) => {
  const res = await searchProducts({ keyword });
  return res.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: { products: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(searchProductsThunk.pending, (state) => { state.loading = true; })
      .addCase(searchProductsThunk.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      });
  }
});

export default productSlice.reducer;