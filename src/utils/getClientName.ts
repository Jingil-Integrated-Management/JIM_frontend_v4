import { ClientData } from '../types';

const getClientName = (clientList: ClientData[], clientID: number) => {
  for (let i = 0; i < clientList.length; i++) {
    if (clientID === clientList[i].id) {
      return clientList[i].name;
    }
  }
  return '';
};

export default getClientName;
