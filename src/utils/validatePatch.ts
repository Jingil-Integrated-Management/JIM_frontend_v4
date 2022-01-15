import { OutsourceData, PartData } from '../types';
import OUTSOURCE from '../constants/OUTSOURCE.json';

export const isExistClient = (client_id: number | undefined) => {
  if (!client_id || client_id === -1) {
    alert('존재하지 않는 회사입니다.');
    return false;
  }

  return true;
};

export const validateClient = (outSourceList: OutsourceData[]) => {
  let isExistOutSourceClient = true;

  outSourceList.forEach(outsource => {
    OUTSOURCE.os_subjects.forEach(subject => {
      if (outsource[(subject + '_client') as keyof OutsourceData] === -1) {
        isExistOutSourceClient = false;
      }
    });
  });

  if (!isExistOutSourceClient) {
    alert('외주 업체를 알맞게 선택해주세요.');
  }

  return isExistOutSourceClient;
};

export const validateDivision = (partList: PartData[]) => {
  let isExistDivision = true;

  partList.forEach(part => {
    if (part.division === -1) {
      isExistDivision = false;
    }
  });

  if (!isExistDivision) {
    alert('구분을 알맞게 선택해주세요.');
  }

  return isExistDivision;
};
