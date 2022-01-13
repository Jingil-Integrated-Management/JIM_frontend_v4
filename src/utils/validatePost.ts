import { DrawingData, PartData } from '../types';

const validatePost = (drawing: DrawingData, parts: PartData[]) => {
  if (drawing.name === '') {
    alert('도면명을 입력하세요.');
    return false;
  } else if (drawing.client < 0) {
    alert('담당 회사를 선택하세요.');
    return false;
  }

  if (parts.length < 1) {
    alert('파트를 최소 1개 입력하세요.');
    return false;
  }

  for (let i = 0; i < parts.length; i++) {
    if (parts[i].division < 0) {
      alert(`${i + 1}번째 파트의 구분을 선택하세요.`);
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
    } else if (parts[i].quantity < 0) {
      alert(`${i + 1}번째 파트의 개수를 입력하세요.`);
      return false;
    }
  }

  return true;
};

export default validatePost;
