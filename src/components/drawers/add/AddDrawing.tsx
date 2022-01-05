import { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { AxiosResponse } from 'axios';
import { ReactComponent as Close } from '../../../resources/close.svg';

import {
  ClientData,
  DrawingData,
  OutsourceData,
  PartData,
} from '../../../types';

import webClient from '../../../utils/Webclient';

import DrawingInput from './DrawingInput';
import PartInput from './PartInput';

import { Drawing, Part, OutSource } from '../../../templates';
import postDrawing from '../../../utils/postDrawing';

interface addDrawingProps {
  setOpen: Function;
  clientList: ClientData[];
}

const AddDrawing = (props: addDrawingProps) => {
  const [drawing, setDrawing] = useState<DrawingData>(Drawing());
  const [parts, setParts] = useState<PartData[]>([]);
  const [osParts, setOsParts] = useState<OutsourceData[]>([]);
  const [mainDivisions, setMainDivisions] = useState<
    { main_division: string }[]
  >([]);
  const [materials, setMaterials] = useState<{ name: string }[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Get inital material data
  useEffect(() => {
    const getMaterial = async () => {
      try {
        const response: AxiosResponse = await webClient.get('material/');
        setMaterials(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMaterial();
    return setMaterials([]);
  }, []);

  // Reset main division list on client change
  useEffect(() => {
    const getDivisions = async () => {
      try {
        const response: AxiosResponse = await webClient.get(
          `/division/main/?client=${drawing.client}`
        );
        setMainDivisions(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (drawing.client > -1) getDivisions();
    return setMainDivisions([]);
  }, [drawing.client]);

  const splicePart = (index: number, action: string) => {
    let copyParts: PartData[] = [...parts];
    let copyOsParts: OutsourceData[] = [...osParts];

    if (action === 'add') {
      copyParts.splice(index + 1, 0, Part());
      copyOsParts.splice(index + 1, 0, OutSource());
    } else {
      copyParts.splice(index, 1);
      copyOsParts.splice(index, 1);
    }

    setParts(copyParts);
    setOsParts(copyOsParts);
  };

  return (
    <div
      id="drawer-container"
      className="w-608 h-auto pb-20 flex justify-center z-10"
    >
      <div className="w-544 h-full">
        <div className="h-15 flex mt-48 justify-between">
          <div className="text-title ml-16 font-bold">도면 추가하기</div>
          <div className="flex flex-row">
            <Close className="cursor-pointer" />
          </div>
        </div>
        <DrawingInput drawing={drawing} setDrawing={setDrawing} />
        {parts.map((_, index) => {
          return (
            <PartInput
              key={index}
              index={index}
              clientId={drawing.client}
              parts={parts}
              setParts={setParts}
              splicePart={splicePart}
              isOutsource={drawing.is_outsource}
              mainDivisions={mainDivisions}
              materialList={materials}
              focusedIndex={focusedIndex}
              setFocusedIndex={setFocusedIndex}
            />
          );
        })}
        <div className="flex justify-end mt-44">
          {parts.length === 0 ? (
            <button
              className="w-105 h-40 rounded-8"
              onClick={() => splicePart(parts.length - 1, 'add')}
            >
              파트 추가하기
            </button>
          ) : (
            <></>
          )}
          <button
            className="w-76 h-40 rounded-8 text-palette-purple-on bg-palette-accent-opac-8"
            onClick={() => {
              postDrawing(drawing, parts, osParts);
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

export default connect(mapStateToProps)(AddDrawing);
