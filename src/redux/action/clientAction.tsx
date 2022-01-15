export const CHANGE_CLIENT_LIST = 'CHANGE_CLIENT_LIST';

interface Client {
  id: number;
  name: string;
  is_pinned: number;
}

export function changeClientList(clientList: Client[]) {
  return {
    type: CHANGE_CLIENT_LIST,
    clientList: clientList,
  };
}
