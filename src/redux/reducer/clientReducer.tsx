import { CHANGE_CLIENT_LIST } from '../action/clientAction';

//axios
import webClient from '../../utils/Webclient';
import { AxiosResponse } from 'axios';

interface Client {
  id: number;
  name: string;
  is_pinned: number;
}

interface Action {
  type: String;
  clientList?: Client[];
}

const initializeState = async () => {
  try {
    const response: AxiosResponse = await webClient.get('client/');
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const initialState = {
  clientList: [],
};

initializeState().then(clientList => {
  initialState.clientList = clientList;
});

const clientReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case CHANGE_CLIENT_LIST:
      return {
        clientList: action.clientList,
      };

    default:
      return state;
  }
};

export default clientReducer;
