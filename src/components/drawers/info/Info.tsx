//icons
import { ReactComponent as CloseIcon } from '../../../resources/svg/closeIcon.svg';
import { ReactComponent as EditIcon } from '../../../resources/svg/editIcon.svg';

//axios
import webClient from '../../../utils/Webclient';

//components
import PartInfo from './PartInfo';
import DrawingInfo from './DrawingInfo';

//types
import { DrawingData, OutsourceData, PartData } from '../../../types';

import OUTSOURCE from '../../../constants/OUTSOURCE.json';

interface tableDrawerProps {
  target: string;
  drawing?: DrawingData;
  parts: PartData[];
  setRevise: Function;
  setOpen: Function;
  type?: string;
}

const Info = (props: tableDrawerProps) => {
  const finishDrawing = async () => {
    if (!isClosed()) {
      alert('가격이 확정되지 않은 파트가 존재합니다.');
      return;
    }

    try {
      await webClient.patch(`drawing/${props.drawing?.id}`, {
        is_closed: true,
      });
      reload('해당 도면의 작업을 완료했습니다.');
    } catch (error) {
      console.log(error);
    }
  };

  const deletePart = async () => {
    try {
      await webClient.delete(`part/${props.parts[0]?.id}`);
      reload('성공적으로 파트가 삭제되었습니다.');
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDrawing = async () => {
    try {
      await webClient.delete(`drawing/${props.drawing?.id}`);
      reload('성공적으로 도면이 삭제되었습니다.');
    } catch (error) {
      console.log(error);
    }
  };

  const validateDelete = () => {
    if (props.target === 'drawing') {
      if (window.confirm('해당 도면을 삭제하시겠습니까?')) {
        deleteDrawing();
      }
    } else if (props.target === 'part') {
      if (window.confirm('해당 파트를 삭제하시겠습니까?')) {
        deletePart();
      }
    }
  };

  const reload = (msg: string) => {
    if (window.confirm(msg)) {
      window.location.reload();
    } else {
      window.location.reload();
    }
  };

  const isClosed = () => {
    for (let i = 0; i < props.parts.length; i++) {
      let isClosed = true;

      if (props.parts[i].price === '' || props.parts[i].price === null)
        isClosed = false;

      if (!isClosed) return isClosed;

      OUTSOURCE.os_subjects.forEach(subject => {
        const tmpOs = props.parts[i].outsource_info;
        if (
          tmpOs &&
          tmpOs[(subject + '_client') as keyof OutsourceData] &&
          !tmpOs[(subject + '_price') as keyof OutsourceData]
        )
          isClosed = false;
      });
      if (!isClosed) return isClosed;
    }

    return true;
  };

  return (
    <div id="drawer-info" className="w-608 h-auto pb-50 flex justify-center">
      <div className="w-544 h-full">
        <div className="h-15 flex mt-48 justify-between">
          <div className="text-title ml-16 font-bold">
            {props.target === 'drawing' ? '도면 정보보기' : '파트 정보보기'}
          </div>
          <div className="flex flex-row">
            <EditIcon
              className="cursor-pointer"
              onClick={() => props.setRevise(true)}
            />
            <CloseIcon
              className="cursor-pointer"
              onClick={() => props.setOpen(false)}
            />
          </div>
        </div>
        {props.drawing && <DrawingInfo drawing={props.drawing} />}
        {props.parts.map((part: any, index: number) => (
          <PartInfo key={index} part={part} index={index} />
        ))}
        <div className="flex justify-end mt-44">
          <button
            className="w-76 text-sm h-40 rounded-8 partDeleteButton"
            onClick={() => validateDelete()}
          >
            삭제하기
          </button>
          <button
            className="w-76 text-sm h-40 rounded-8 partDeleteButton"
            onClick={() => props.setRevise(true)}
          >
            수정하기
          </button>
          {props.drawing && props.type === 'dashboard' ? (
            <button
              onClick={() => {
                finishDrawing();
              }}
              className="w-76 text-sm h-40 rounded-8 completeButton"
            >
              완료하기
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Info;
