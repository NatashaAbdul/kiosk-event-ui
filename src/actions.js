import { ORDER_CLEAR, NUMBER_SET_TYPE, ATTENDEE_SET_TYPE } from "./constants";

export const setNumber = (dispatch, number) => {
  return dispatch({
    type: NUMBER_SET_TYPE,
    payload: number,
  });
};

export const setAttendee = (dispatch, attendee) => {
  return dispatch({
    type: ATTENDEE_SET_TYPE,
    payload: attendee,
  });
};
export const clearOrder = async (dispatch) => {
  return dispatch({
    type: ORDER_CLEAR,
  });
};
