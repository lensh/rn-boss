const initalState = {
  page: 1,
  list: [],
  isLoading: false
};

export default function messageList(state = initalState, action) {
  switch (action.type) {
    case 'INIT_MESSAGE_LIST': {
      return action.data;
    }
    case 'UPDATE_MESSAGE_LIST': {
      const result = {...state, ...action.data};
      return result;
    }
    case 'CHANGE_LIST_LOADING': {
      const result = {...state, ...action.data};
      return result;
    }
    default:
      return state;
  }
}
