import { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { DivisionData, OutsourceData, PartData } from '../../../types';
import getDivisionID from '../../../utils/getDivisionID';
import getSubDivisionName from '../../../utils/getSubDivisionName';
import webClient from '../../../utils/Webclient';

import { ReactComponent as UploadImage } from '../../../resources/svg/imageUpload.svg';
import OutSourceInput from './OutSourceInput';

interface partListControlProps {
  index: number;
  splicePart: Function;
}

interface partInputProps {
  index: number;
  clientId: number;
  parts: PartData[];
  setParts: Function;
  osParts: OutsourceData[];
  setOsParts: Function;
  splicePart: Function;
  isOutsource: boolean;
  mainDivisions: { main_division: string }[];
  materialList: { name: string }[];
  focusedIndex: number;
  setFocusedIndex: Function;
}

const PartListControl = (props: partListControlProps) => {
  return (
    <div className="flex justify-end mt-32">
      <button
        className="w-105 h-40 text-sm bg-palette-grey-2-hover item-border"
        onClick={() => {
          props.splicePart(props.index, 'del');
        }}
      >
        파트 제거하기
      </button>
      <button
        className="w-105 h-40 text-sm"
        onClick={() => {
          props.splicePart(props.index, 'add');
        }}
      >
        파트 추가하기
      </button>
    </div>
  );
};

const PartInput = (props: partInputProps) => {
  const [selectedMainDivision, setSelectedMainDivision] = useState<string>('');
  const [divisionList, setDivisionList] = useState<DivisionData[]>([]);

  const inputFile = useRef<HTMLInputElement>(null);

  const previewImage = (event: any, index: number) => {
    let reader: FileReader = new FileReader();
    reader.onload = () => {
      onInputChange('fileData', event.target.files[0]);
      onInputChange('fileSrc', reader.result as string);
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const onInputChange = <K extends keyof PartData, V extends PartData[K]>(
    key: K,
    value: V
  ) => {
    const tmpParts = [...props.parts];
    tmpParts[props.index][key] = value;

    props.setParts(tmpParts);
  };

  // Reset division on main division list change
  useEffect(() => {
    setSelectedMainDivision('');
    setDivisionList([]);
    onInputChange('division', -1);
  }, [props.mainDivisions]);

  useEffect(() => {
    const getDivisions = async () => {
      try {
        const response: AxiosResponse = await webClient.get(
          `division/?client=${props.clientId}&main_division=${selectedMainDivision}`
        );
        setDivisionList(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedMainDivision !== '') getDivisions();
  }, [selectedMainDivision]);

  return (
    <div onClick={() => props.setFocusedIndex(props.index)}>
      <div className="flex flex-row mt-50">
        <div className="flex justify-center items-center w-40 h-40 bg-palette-purple-index rounded-panel">
          {props.index + 1}
        </div>
        <div className="flex justify-center items-center w-95 h-40 ml-10 rounded-panel bg-palette-grey">
          파트 정보
        </div>
      </div>
      <div className="flex justify-center items-center">
        <input
          type="file"
          id={`file_${props.index}`}
          ref={inputFile}
          style={{ display: 'none' }}
          onChange={(e) => {
            previewImage(e, props.index);
          }}
        />
        {!props.parts[props.index].fileSrc ? (
          <div
            className="w-504 h-306 mt-32 flex justify-center items-center rounded-8 imageBox cursor-pointer part-input-upload-image"
            onClick={() => {
              inputFile.current && inputFile.current.click();
            }}
          >
            <UploadImage />
          </div>
        ) : (
          <img
            className="w-504 h-306 mt-32 rounded-8 cursor-pointer"
            src={props.parts[props.index].fileSrc}
            alt="selected_part_img"
            onClick={() => {
              inputFile.current && inputFile.current.click();
            }}
          />
        )}
      </div>
      <div className="mt-24 h-72 flex">
        <div className="w-256">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            메인 구분
          </div>
          <input
            list={`main_div${props.index}`}
            className="client w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input"
            placeholder="메인 구분을 선택하세요."
            value={selectedMainDivision}
            onChange={(e) => {
              setSelectedMainDivision(e.target.value);
              onInputChange('division', -1);
            }}
          />
          <datalist id={`main_div${props.index}`}>
            {props.mainDivisions.map(
              (division: { main_division: string }, index) => {
                return <option key={index} value={division.main_division} />;
              }
            )}
          </datalist>
        </div>
        <div className="w-256 ml-32">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            세부 구분
          </div>
          <input
            list={`sub_div${props.index}`}
            className="flex items-center client w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input"
            placeholder="세부 구분을 선택하세요."
            value={getSubDivisionName(
              divisionList,
              props.parts[props.index].division
            )}
            onChange={(e) => {
              onInputChange(
                'division',
                getDivisionID(divisionList, e.target.value)
              );
            }}
          />
          <datalist id={`sub_div${props.index}`}>
            {divisionList.map((division: DivisionData) => {
              return (
                <option
                  key={division.id}
                  value={
                    division.sub_division === null
                      ? '없음'
                      : division.sub_division
                  }
                />
              );
            })}
          </datalist>
        </div>
      </div>
      <div className="mt-12 flex">
        <div className="w-160">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트크기- X
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            placeholder="내용을 입력하세요."
            value={props.parts[props.index].x}
            onChange={(e) => {
              onInputChange('x', e.target.value);
            }}
          ></input>
        </div>
        <div className="ml-32 w-160">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트크기- Y
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            placeholder="내용을 입력하세요."
            value={props.parts[props.index].y}
            onChange={(e) => {
              onInputChange('y', e.target.value);
            }}
          ></input>
        </div>
        <div className="ml-32 w-160">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트크기- Z
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            placeholder="내용을 입력하세요."
            value={props.parts[props.index].z}
            onChange={(e) => {
              onInputChange('z', e.target.value);
            }}
          ></input>
        </div>
      </div>
      <div className="mt-12 flex flex-row">
        <div className="w-256">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            소재
          </div>
          <select
            className="w-full text-sm h-48 px-12 rounded-8 bg-palette-purple-input flex items-center outline-none"
            value={props.parts[props.index].material}
            onChange={(e) => onInputChange('material', e.target.value)}
          >
            {props.materialList.map((material, index) => {
              return (
                <option key={index} value={material.name}>
                  {material.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="w-256 ml-32">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트 개수
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            placeholder="내용을 입력하세요."
            value={props.parts[props.index].quantity}
            onChange={(e) => {
              onInputChange('quantity', Number(e.target.value));
            }}
          ></input>
        </div>
      </div>
      <div className="mt-12 flex flex-row">
        <div className="w-256">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            가격
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            placeholder="내용을 입력하세요."
            value={
              props.parts[props.index].price
                ? (props.parts[props.index].price as string)
                : ''
            }
            onChange={(e) => {
              onInputChange('price', e.target.value);
            }}
          ></input>
        </div>
        <div className="w-256 ml-32">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            비고
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            placeholder="내용을 입력하세요."
            value={
              props.parts[props.index].comment
                ? (props.parts[props.index].comment as string)
                : ''
            }
            onChange={(e) => {
              onInputChange('comment', e.target.value);
            }}
          ></input>
        </div>
      </div>
      {props.isOutsource ? (
        <OutSourceInput
          osParts={props.osParts}
          setOsParts={props.setOsParts}
          index={props.index}
        />
      ) : (
        <></>
      )}
      {props.focusedIndex === props.index ? (
        <PartListControl index={props.index} splicePart={props.splicePart} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default PartInput;
