import { useEffect, useState } from 'react';

//types
import { PartData, DivisionData, OutsourceData } from '../../../types';

//axios
import webClient from '../../../utils/Webclient';
import { AxiosResponse } from 'axios';

//icons
import { ReactComponent as ImageEmpty } from '../../../resources/svg/imageEmpty.svg';

//utils
import getDivisionID from '../../../utils/getDivisionID';

//components
import OutSource from './PatchOutSourcePart';

interface PatchPartProps {
  part: PartData;
  index: number;
  mainDivisionList: { main_division: string }[];
  materialList: { name: string }[];
  targetPartList: PartData[];
  setTargetPartList: Function;
  targetOutSourcePartList: OutsourceData[];
  setTargetOutSourcePartList: Function;
}

const PatchPart = (props: PatchPartProps) => {
  const { mainDivisionList, materialList, index } = props;
  const [fileName, setFileName] = useState<string | null | undefined>(
    props.part.file_name
  );
  const [partInputForm, setPartInputForm] = useState({
    main_division: props.part.division__main_division,
    sub_division: props.part.division__sub_division
      ? props.part.division__sub_division
      : '',
  });
  const [subDivisionList, setSubDivisionList] = useState<DivisionData[]>([]);

  const onInputChange = <K extends keyof PartData, V extends PartData[K]>(
    key: K,
    value: V
  ) => {
    props.setTargetPartList((prev: PartData[]) => {
      let tmp = [...prev];
      tmp[props.index][key] = value;
      return tmp;
    });
  };

  useEffect(() => {
    if (props.part.division__main_division) {
      getSubDivisionList(props.part.division__main_division);
    }
  }, []);

  const getSubDivisionList = async (mainDivision: String) => {
    try {
      const response: AxiosResponse = await webClient.get(
        `/division/?client=${props.part.client__id}&main_division=${mainDivision}`
      );
      setSubDivisionList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const isExistMainDivision = (input: string) => {
    return mainDivisionList.find(division => division.main_division === input);
  };

  const getExistSubDivision = (input: string) => {
    const mainDivision = isExistMainDivision(input);

    if (mainDivision) {
      getSubDivisionList(mainDivision.main_division);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response: AxiosResponse = await webClient.post('files/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    onInputChange('file', response.data.id);
    setFileName(response.data.file);
  };

  useEffect(() => {
    if (props.part.division__main_division) {
      getSubDivisionList(props.part.division__main_division);
    }
  }, []);

  return (
    <div>
      <div className="flex flex-row mt-36">
        <div className="flex justify-center items-center w-40 h-40 bg-palette-purple-index rounded-panel">
          {index + 1}
        </div>
        <div className="flex justify-center items-center w-95 h-40 ml-10 rounded-panel bg-palette-grey">
          파트 정보
        </div>
      </div>
      <input
        type="file"
        id={`file_${index}`}
        className="hidden"
        onChange={e => {
          if (e.target.files) uploadFile(e.target.files[0]);
        }}
      />
      <label
        className="flex justify-center items-center cursor-pointer"
        htmlFor={`file_${index}`}
      >
        {!fileName ? (
          <div className="w-544 h-306 mt-32 flex justify-center items-center rounded-8 imageBox">
            <ImageEmpty />
          </div>
        ) : (
          <img
            className="w-544 h-306 mt-32 rounded-8"
            src={`https://storage.googleapis.com/jim-storage/${fileName}`}
            alt="part_image"
          />
        )}
      </label>
      <div className="mt-24 h-72 flex">
        <div className="w-256">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            메인 구분
          </div>
          <input
            className="client w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            list={`main_division_list_${index}`}
            value={partInputForm.main_division}
            autoComplete="off"
            onChange={e => {
              setPartInputForm({
                ...partInputForm,
                main_division: e.target.value,
              });
              getExistSubDivision(e.target.value);
            }}
          />
          <datalist id={`main_division_list_${index}`}>
            {mainDivisionList.map(
              (division: { main_division: string }, index: number) => {
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
            className="client w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            list={`sub_division_list_${index}`}
            value={partInputForm.sub_division}
            autoComplete="off"
            onChange={e => {
              setPartInputForm({
                ...partInputForm,
                sub_division: e.target.value,
              });
              // TODO : -1일 경우
              onInputChange(
                'division',
                getDivisionID(subDivisionList, e.target.value)
              );
            }}
          />
          <datalist id={`sub_division_list_${index}`}>
            {subDivisionList.map((division: DivisionData, index: number) => {
              return (
                <option
                  key={index}
                  value={division.sub_division ? division.sub_division : '없음'}
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
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={props.targetPartList[props.index].x}
            onChange={e => onInputChange('x', e.target.value)}
          />
        </div>
        <div className="ml-32 w-160">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트크기- Y
          </div>
          <input
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={props.targetPartList[props.index].y}
            onChange={e => onInputChange('y', e.target.value)}
          />
        </div>
        <div className="ml-32 w-160">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트크기- Z
          </div>
          <input
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={props.targetPartList[props.index].z}
            onChange={e => onInputChange('z', e.target.value)}
          />
        </div>
      </div>
      <div className="mt-12 flex flex-row">
        <div className="w-256">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            소재
          </div>
          <input
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            list={`material_list_${index}`}
            autoComplete="off"
            value={props.targetPartList[props.index].material}
            onChange={e => onInputChange('material', e.target.value)}
          />
          <datalist id={`material_list_${index}`}>
            {materialList.map((material: { name: string }, index: number) => {
              return <option key={index} value={material.name} />;
            })}
          </datalist>
        </div>
        <div className="w-256 ml-32">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트 개수
          </div>
          <input
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={props.targetPartList[props.index].quantity}
            onChange={e =>
              onInputChange(
                'quantity',
                Number.isInteger(Number(e.target.value))
                  ? Number(e.target.value)
                  : 0
              )
            }
          />
        </div>
      </div>
      <div className="mt-12 flex flex-row">
        <div className="w-256">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            가격
          </div>
          <input
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={props.targetPartList[props.index].price || ''}
            onChange={e => onInputChange('price', e.target.value)}
          />
        </div>
        <div className="w-256 ml-32">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            비고
          </div>
          <input
            className="w-full text-sm mt-2 h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={props.targetPartList[props.index].comment || ''}
            onChange={e => onInputChange('comment', e.target.value)}
          />
        </div>
      </div>
      {props.part.drawing__is_outsource && props.part.outsource_info ? (
        <OutSource
          index={index}
          targetOutSourcePartList={props.targetOutSourcePartList}
          setTargetOutSourcePartList={props.setTargetOutSourcePartList}
          part={props.part}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default PatchPart;
