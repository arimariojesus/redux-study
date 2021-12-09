import { Reducer } from "react";
import { AnyAction } from "redux";
import { ICartState } from "./types";

const INITIAL_STATE: ICartState = {
  items: [],
};

const cart: Reducer<ICartState, AnyAction> = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_PRODUCT_TO_CART':
      const { product } = action.payload;
      const newState = {
        ...state,
        items: [
          ...state.items,
          {
            product,
            quantity: 1,
          }
        ],
      };

      return newState;
    default:
      return state;
  }
}

export default cart;