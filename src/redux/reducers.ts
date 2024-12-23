// src/redux/reducers.js

const initialState = {
  counter: 0,
  admin: "",
};

const counterReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        counter: state.counter + 1,
      };
    case "SETADMIN":
      return {
        ...state,
        admin: action.admin,
      };
    default:
      return state;
  }
};

export default counterReducer;
