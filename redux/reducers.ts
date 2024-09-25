import { SET_PRODUCT_DETAILS } from './actions';

const initialState = {
  id: null,
  sellingPrice: 0,
};

const productReducer = (state = initialState, action:any) => {
  switch (action.type) {
    case SET_PRODUCT_DETAILS:
      return {
        ...state,
        id: action.payload.id,
        sellingPrice: action.payload.sellingPrice,
      };
    default:
      return state;
  }
};

export default productReducer;
