import { useEffect, useState } from 'react';

//icons
import { ReactComponent as CloseIcon } from '../../../resources/close.svg';

//types
import { DrawingData, PartData, ClientData } from '../../../types';

//axios
import webClient from '../../../utils/Webclient';
import { AxiosResponse } from 'axios';

//redux
import { connect } from 'react-redux';

//components
import PatchPart from './PatchPart';
import PatchDrawing from './PatchDrawing';

interface PatchProps {
  target: String;
  setRevise: Function;
  parts: PartData[];
  drawing?: DrawingData;
  setOpen: Function;
  clientList: ClientData[];
}

const Patch = (props: PatchProps) => {
  const clientId = props.parts[0].client__id;
  const [mainDivisionList, setMainDivisionList] = useState<
    { main_division: string }[]
  >([]);
  const [materialList, setMaterialList] = useState<{ name: string }[]>([]);
  const [targetPartList, setTargetPartList] = useState<PartData[]>([]);
  const [targetDrawing, setTargetDrawing] = useState<DrawingData | null>(null);

  useEffect(() => {
    getMainDivisionList();
    getMaterialList();
  }, []);

  const getMainDivisionList = async () => {
    try {
      const response: AxiosResponse = await webClient.get(
        `/division/main/?client=${clientId}`
      );
      setMainDivisionList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getMaterialList = async () => {
    try {
      const response: AxiosResponse = await webClient.get('material/');
      setMaterialList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const validateTargetDrawing = () => {
    if (targetDrawing?.client === -1) {
      alert('존재하지 않는 회사입니다.');
      return false;
    }

    return true;
  };

  const patchDrawing = async () => {
    if (!props.drawing || !validateTargetDrawing()) {
      return;
    }

    try {
      const response: AxiosResponse = await webClient.patch(
        `/drawing/${props.drawing.id}`,
        targetDrawing
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const patchParts = async () => {
    for (let index = 0; index < props.parts.length; index++) {
      let partId = props.parts[index].id!;

      try {
        const response: AxiosResponse = await webClient.patch(
          `/part/${partId}`,
          targetPartList[index]
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      id="patch-container"
      className="w-608 h-auto pb-50 flex justify-center"
    >
      <div className="w-544 h-full">
        <div className="h-15 flex mt-48 justify-between">
          <div className="text-title ml-16 font-bold">
            {props.target === 'drawing' ? '도면 수정하기' : '파트 수정하기'}
          </div>
          <div className="flex flex-row">
            <CloseIcon
              className="cursor-pointer"
              onClick={() => props.setRevise(false)}
            />
          </div>
        </div>
        {props.drawing && (
          <PatchDrawing
            drawing={props.drawing}
            clientList={props.clientList}
            setTargetDrawing={setTargetDrawing}
          />
        )}
        {props.parts.map((part: any, index: number) => (
          <PatchPart
            key={index}
            part={part}
            index={index}
            mainDivisionList={mainDivisionList}
            materialList={materialList}
            targetPartList={targetPartList}
            setTargetPartList={setTargetPartList}
          />
        ))}
        <div className="flex justify-end mt-44">
          <button
            className="text-sm h-40"
            onClick={() => {
              console.log(targetDrawing);
              console.log(targetPartList);
              patchDrawing();
              patchParts();
            }}
          >
            완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps)(Patch);
