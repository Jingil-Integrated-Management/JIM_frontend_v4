import { useEffect, useState } from 'react';

//types
import { PartData, DivisionData } from '../../../types';

//axios
import webClient from '../../../utils/Webclient';
import { AxiosResponse } from 'axios';

//icons
import { ReactComponent as ImageEmpty } from '../../../resources/image_empty.svg';

//utils
import getDivisionID from '../../../utils/getDivisionID';

interface PatchPartProps {
  part: PartData;
  index: number;
  mainDivisionList: { main_division: string }[];
  materialList: { name: string }[];
  targetPartList: PartData[];
  setTargetPartList: Function;
}

const PatchPart = (props: PatchPartProps) => {
  // TODO : OS PART일 때의 수정
  // TODO : 도면 사진 수정
  // TODO : 예외 처리

  const { part, mainDivisionList, materialList, index } = props;
  const [fileName, setFileName] = useState<string | null | undefined>(
    props.part.file_name
  );
  const [partPatchForm, setPartPatchForm] = useState({
    x: props.part.x,
    y: props.part.y,
    z: props.part.z,
    quantity: props.part.quantity,
    price: props.part.price,
    comment: props.part.comment,
    drawing: props.part.drawing,
    division: props.part.division,
    material: props.part.material,
    outsource: props.part.outsource,
    file: props.part.file,
  });
  const [partInputForm, setPartInputForm] = useState({
    main_division: props.part.division__main_division,
    sub_division: props.part.division__sub_division
      ? props.part.division__sub_division
      : '',
  });
  const [subDivisionList, setSubDivisionList] = useState<DivisionData[]>([]);

  useEffect(() => {
    props.setTargetPartList([...props.targetPartList, partPatchForm]);
    if (props.part.division__main_division) {
      getSubDivisionList(props.part.division__main_division);
    }
    console.log(fileName);
  }, []);

  useEffect(() => {
    props.targetPartList[index] = partPatchForm;
  }, [partPatchForm]);

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
      console.log(index);
      console.log(mainDivision);
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

    setPartPatchForm({ ...partPatchForm, file: response.data.id });
    setFileName(response.data.file);
  };

  return (
    <div>
      <div className="flex flex-row mt-50">
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
          <div className="w-504 h-306 mt-32 flex justify-center items-center rounded-8 imageBox">
            <ImageEmpty />
          </div>
        ) : (
          <img
            className="w-504 h-306 mt-32 rounded-8"
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
            className="client w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            list={`main_division_list_${index}`}
            value={partInputForm.main_division}
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
            className="client w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            list={`sub_division_list_${index}`}
            value={partInputForm.sub_division}
            onChange={e => {
              setPartInputForm({
                ...partInputForm,
                sub_division: e.target.value,
              });
              setPartPatchForm({
                ...partPatchForm,
                division: getDivisionID(subDivisionList, e.target.value),
              }); // TODO : -1일 경우
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
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={partPatchForm.x}
            onChange={e =>
              setPartPatchForm({
                ...partPatchForm,
                x: e.target.value,
              })
            }
          />
        </div>
        <div className="ml-32 w-160">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트크기- Y
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={partPatchForm.y}
            onChange={e =>
              setPartPatchForm({
                ...partPatchForm,
                y: e.target.value,
              })
            }
          />
        </div>
        <div className="ml-32 w-160">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            파트크기- Z
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={partPatchForm.z}
            onChange={e =>
              setPartPatchForm({
                ...partPatchForm,
                z: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="mt-12 flex flex-row">
        <div className="w-256">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            소재
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            list={`material_list_${index}`}
            value={partPatchForm.material}
            onChange={e => {
              setPartPatchForm({
                ...partPatchForm,
                material: e.target.value,
              });
            }}
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
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={partPatchForm.quantity}
            onChange={e =>
              setPartPatchForm({
                ...partPatchForm,
                quantity: Number.isInteger(Number(e.target.value))
                  ? Number(e.target.value)
                  : 0,
              })
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
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={partPatchForm.price ? partPatchForm.price : ''}
            onChange={e =>
              setPartPatchForm({
                ...partPatchForm,
                price: e.target.value,
              })
            }
          />
        </div>
        <div className="w-256 ml-32">
          <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            비고
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={partPatchForm.comment ? partPatchForm.comment : ''}
            onChange={e =>
              setPartPatchForm({
                ...partPatchForm,
                comment: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PatchPart;
