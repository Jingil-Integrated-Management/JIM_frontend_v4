import { DivisionData } from '../types';

const getDivisionID = (divisionList: DivisionData[], subDivision: string) => {
  for (let i = 0; i < divisionList.length; i++) {
    if (
      subDivision === divisionList[i].sub_division ||
      (subDivision === '없음' && divisionList[i].sub_division === null)
    ) {
      return divisionList[i].id as number;
    }
  }
  return -1;
};

export default getDivisionID;
