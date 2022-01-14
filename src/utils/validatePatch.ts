export const isExistClient = (client_id: number | undefined) => {
  if (!client_id || client_id === -1) {
    alert('존재하지 않는 회사입니다.');
    return false;
  }

  return true;
};
