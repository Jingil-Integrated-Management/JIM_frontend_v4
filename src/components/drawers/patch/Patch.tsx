import { useEffect, useState } from 'react';

//icons
import { ReactComponent as CloseIcon } from '../../../resources/close.svg';
import { ReactComponent as ImageEmpty } from '../../../resources/image_empty.svg';

//types
import {
  DrawingData,
  PartData,
  DivisionData,
  ClientData,
} from '../../../types';

//axios
import webClient from '../../../utils/Webclient';
import { AxiosResponse } from 'axios';

//utils
import getDivisionID from '../../../utils/getDivisionID';

//redux
import { connect } from 'react-redux';

interface PatchProps {
  target: String;
  setRevise: Function;
  parts: PartData[];
  drawing?: DrawingData;
  setOpen: Function;
  clientList: ClientData[];
}

interface PatchDrawingProps {
  drawing: DrawingData;
  clientList: ClientData[];
  setTargetDrawing: Function;
}

interface PatchPartProps {
  part: PartData;
  index: number;
  mainDivisionList: { main_division: string }[];
  materialList: { name: string }[];
  targetPartList: PartData[];
  setTargetPartList: Function;
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

const PatchDrawing = (props: PatchDrawingProps) => {
  // TODO : 날짜 수정

  const [drawingPatchForm, setDrawingPatchForm] = useState({
    name: props.drawing.name,
    client: props.drawing.client,
    created_at: props.drawing.created_at,
    comment: props.drawing.comment ? props.drawing.comment : '',
  });
  const [clientName, setClientName] = useState<string>(
    props.drawing.client__name ? props.drawing.client__name : ''
  );

  useEffect(() => {
    props.setTargetDrawing(drawingPatchForm);
  }, [drawingPatchForm]);

  const getClientId = (clientName: string) => {
    const client = isExistClient(clientName);

    if (client) {
      return client.id ? client.id : -1;
    }

    return -1;
  };

  const isExistClient = (clientName: string): ClientData | undefined => {
    return props.clientList.find(client => client.name === clientName);
  };

  return (
    <div className="w-full h-220">
      <div className="flex mt-53">
        <div className="flex justify-center items-center w-95 h-40 rounded-panel bg-palette-grey">
          도면 정보
        </div>
        {props.drawing.is_outsource ? (
          <div className="flex justify-center items-center w-62 h-40 ml-10 rounded-panel onOsBox">
            외주
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="mt-24 h-72 flex">
        <div className="w-256">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            도면명
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={drawingPatchForm.name}
            onChange={e =>
              setDrawingPatchForm({
                ...drawingPatchForm,
                name: e.target.value,
              })
            }
          />
        </div>
        <div className="w-256 ml-32">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            담당회사
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            list="client-list"
            value={clientName}
            onChange={e => {
              setClientName(e.target.value);
              setDrawingPatchForm({
                ...drawingPatchForm,
                client: getClientId(e.target.value),
              });
            }}
          />
          <datalist id="client-list">
            {props.clientList.map((client: ClientData, index: number) => {
              return <option key={index} value={client.name} />;
            })}
          </datalist>
        </div>
      </div>
      <div className="mt-12 h-72 flex">
        <div className="w-256">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            날짜
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={drawingPatchForm.created_at}
            onChange={e =>
              setDrawingPatchForm({
                ...drawingPatchForm,
                created_at: e.target.value,
              })
            }
          />
        </div>
        <div className="w-256 ml-32">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            비고
          </div>
          <input
            className="w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            value={drawingPatchForm.comment}
            onChange={e =>
              setDrawingPatchForm({
                ...drawingPatchForm,
                comment: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

const PatchPart = (props: PatchPartProps) => {
  // TODO : OS PART일 때의 수정
  // TODO : 도면 사진 수정
  // TODO : 예외 처리

  const { part, mainDivisionList, materialList, index } = props;
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
      getSubDivisionList(mainDivision.main_division);
    }
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
      <div className="flex justify-center items-center">
        {!part.file_name ? (
          <div className="w-504 h-306 mt-32 flex justify-center items-center rounded-8 imageBox">
            <ImageEmpty />
          </div>
        ) : (
          <img
            className="w-504 h-306 mt-32 rounded-8"
            src={`https://storage.googleapis.com/jim-storage/${part.file_name}`}
            alt="part_image"
          />
        )}
      </div>
      <div className="mt-24 h-72 flex">
        <div className="w-256">
          <div className="w-full text-sm font-medium leading-1.14 text-palette-grey-menuicons">
            메인 구분
          </div>
          <input
            className="client w-full text-sm h-48 pl-12 rounded-8 bg-palette-purple-input flex items-center"
            list="main_division_list"
            value={partInputForm.main_division}
            onChange={e => {
              setPartInputForm({
                ...partInputForm,
                main_division: e.target.value,
              });
              getExistSubDivision(e.target.value);
            }}
          />
          <datalist id="main_division_list">
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
            list="sub_division_list"
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
          <datalist id="sub_division_list">
            {subDivisionList.map((division: DivisionData, index: number) => {
              return (
                <option
                  key={index}
                  value={division.sub_division ? division.sub_division : ''}
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
            list="material_list"
            value={partPatchForm.material}
            onChange={e => {
              setPartPatchForm({
                ...partPatchForm,
                material: e.target.value,
              });
            }}
          />
          <datalist id="material_list">
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

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps)(Patch);
