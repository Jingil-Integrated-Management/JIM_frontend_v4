import { ClientData } from '../types';

const getClientID = (clientList: ClientData[], clientName: string) => {
  for (let i = 0; i < clientList?.length; i++) {
    if (clientName === clientList[i].name) return clientList[i].id as number;
  }
  return -1;
};

export default getClientID;
