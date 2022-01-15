import { OutsourceData, PartData } from '../types';
import OUTSOURCE from '../constants/OUTSOURCE.json';

export const isExistClient = (client_id: number | undefined) => {
  if (!client_id || client_id === -1) {
    alert('존재하지 않는 회사입니다.');
    return false;
  }

  return true;
};

export const validateDrawingName = (drawingName: string | undefined) => {
  if (!drawingName || drawingName === '') {
    alert('도면명을 입력하세요.');
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

export const validateParts = (parts: PartData[]) => {
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].division < 0) {
      alert(`${i + 1}번째 파트의 구분을 알맞게 선택하세요.`);
      return false;
    } else if (parts[i].x === '') {
      alert(`${i + 1}번째 파트의 X값을 입력하세요.`);
      return false;
    } else if (parts[i].y === '') {
      alert(`${i + 1}번째 파트의 Y값을 입력하세요.`);
      return false;
    } else if (parts[i].z === '') {
      alert(`${i + 1}번째 파트의 Z값을 입력하세요.`);
      return false;
    } else if (parts[i].material === '') {
      alert(`${i + 1}번째 파트의 소재를 선택하세요.`);
      return false;
    } else if (parts[i].quantity <= 0) {
      alert(`${i + 1}번째 파트의 개수를 입력하세요.`);
      return false;
    }
  }

  return true;
};
