import { useEffect, useState } from 'react';

//icons
import { ReactComponent as CloseIcon } from '../../../resources/close.svg';

//types
import {
  DrawingData,
  PartData,
  ClientData,
  OutsourceData,
} from '../../../types';

//axios
import webClient from '../../../utils/Webclient';
import { AxiosResponse } from 'axios';

//redux
import { connect } from 'react-redux';

//components
import PatchPart from './PatchPart';
import PatchDrawing from './PatchDrawing';

//utils
import { isExistClient } from '../../../utils/validatePatch';

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
  const [targetPartList, setTargetPartList] = useState<PartData[]>(props.parts);
  const [targetDrawing, setTargetDrawing] = useState<DrawingData | undefined>(
    props.drawing
  );
  const [targetOutSourcePartList, setTargetOutSourcePartList] = useState<
    OutsourceData[]
  >(() => {
    let initialList: OutsourceData[] = [];

    props.parts.forEach(part => {
      if (part.outsource_info) initialList.push(part.outsource_info);
    });

    return initialList;
  });

  const getMaterialList = async () => {
    try {
      const response: AxiosResponse = await webClient.get('material/');
      setMaterialList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const patchDrawing = async () => {
    if (!props.drawing || !isExistClient(targetDrawing?.client)) {
      return;
    }

    try {
      await webClient.patch(`/drawing/${props.drawing.id}`, targetDrawing);
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

  const patchOutSource = async () => {
    if (!props.parts[0].drawing__is_outsource) return;

    targetOutSourcePartList.forEach(async outsource => {
      try {
        const response: AxiosResponse = await webClient.patch(
          `/outsource/${outsource.id}`,
          outsource
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
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

    getMainDivisionList();
    getMaterialList();
  }, [clientId]);

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
        {props.drawing && targetDrawing && (
          <PatchDrawing
            drawing={props.drawing}
            clientList={props.clientList}
            targetDrawing={targetDrawing}
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
            targetOutSourcePartList={targetOutSourcePartList}
            setTargetOutSourcePartList={setTargetOutSourcePartList}
          />
        ))}
        <div className="flex justify-end mt-44">
          <button
            className="text-sm h-40"
            onClick={() => {
              patchDrawing();
              patchParts();
              patchOutSource();
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
