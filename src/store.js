import React, { createContext, useReducer } from "react";
import { ORDER_CLEAR, NUMBER_SET_TYPE, ATTENDEE_SET_TYPE } from "./constants";

export const Store = createContext();

const initialState = {
  number: {},
  attendee: {},
};

function reducer(state, action) {
  switch (action.type) {
    case NUMBER_SET_TYPE:
      return {
        ...state,
        number: { ...state.number, number: action.payload },
      };
    case ATTENDEE_SET_TYPE:
      return {
        ...state,
        attendee: { ...state.attendee, attendee: action.payload },
      };

    case ORDER_CLEAR:
      return {
        number: {},
        attendee: {},
      };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
