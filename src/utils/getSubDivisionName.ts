import { DivisionData } from '../types';

const getSubDivisionName = (
  divisionList: DivisionData[],
  divisionID: number
) => {
  for (let i = 0; i < divisionList.length; i++) {
    if (divisionID === divisionList[i].id) {
      return divisionList[i].sub_division as string;
    }
  }
  return '';
};

export default getSubDivisionName;
