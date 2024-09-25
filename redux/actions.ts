// Action Types
export const SET_PRODUCT_DETAILS = "SET_PRODUCT_DETAILS";

// Action Creators
export const setProductDetails = (id: string, sellingPrice: number) => ({
  type: SET_PRODUCT_DETAILS,
  payload: { id, sellingPrice },
});
