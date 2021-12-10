import { Reducer } from "react";
import produce from "immer";
import { AnyAction } from "redux";
import { ICartState } from "./types";

const INITIAL_STATE: ICartState = {
  items: [],
};

const cart: Reducer<ICartState, AnyAction> = (
  state = INITIAL_STATE,
  action
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case "ADD_PRODUCT_TO_CART":
        const { product } = action.payload;

        draft.items.push({
          product,
          quantity: 1,
        });
        
        break;
      default:
        return draft;
    }
  });
};

export default cart;
