import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

//types
import { OutsourceData, ClientData, PartData } from '../../../types';

//utils
import getClientID from '../../../utils/getClientID';
import OUTSOURCE from '../../../constants/OUTSOURCE.json';

interface outSourceProps {
  setOsPart: Function;
  index: number;
  clientList: ClientData[];
  targetOutSourcePartIdList: number[];
  setTargetOutSourcePartIdList: Function;
  targetOutSourcePartList: OutsourceData[];
  setTargetOutSourcePartList: Function;
  part: PartData;
}

const OutSource = (props: outSourceProps) => {
  const [selectedOs, setSelectedOs] = useState<Set<string>>(new Set());

  const onInputChange = <
    K extends keyof OutsourceData,
    V extends OutsourceData[K]
  >(
    key: K,
    value: V
  ) => {
    props.setTargetOutSourcePartList((prev: OutsourceData[]) => {
      let tmp = [...prev];
      tmp[props.index][key] = value;
      return tmp;
    });
  };

  const manageSubject = (subject: string) => {
    const tmpSelectdOs = new Set(selectedOs);

    if (tmpSelectdOs.has(subject)) {
      tmpSelectdOs.delete(subject);
      onInputChange((subject + '_client') as keyof OutsourceData, null);
      onInputChange((subject + '_price') as keyof OutsourceData, null);
      onInputChange((subject + '_client__name') as keyof OutsourceData, null);
    } else {
      tmpSelectdOs.add(subject);
    }

    setSelectedOs(tmpSelectdOs);
  };

  const initSubject = () => {
    if (!props.part.outsource_info) return;

    const initialSubjects = new Set<string>();

    if (props.part.outsource_info.material_client) {
      initialSubjects.add('material');
    }
    if (props.part.outsource_info.heat_treat_client) {
      initialSubjects.add('heat_treat');
    }
    if (props.part.outsource_info.milling_client) {
      initialSubjects.add('milling');
    }
    if (props.part.outsource_info.wire_client) {
      initialSubjects.add('wire');
    }

    setSelectedOs(initialSubjects);
  };

  useEffect(() => {
    initSubject();
  }, []);

  useEffect(() => {
    if (props.part.outsource_info) {
      props.targetOutSourcePartList.push({
        id: props.part.outsource_info.id,
        material_price: props.part.outsource_info.material_price,
        milling_price: props.part.outsource_info.milling_price,
        heat_treat_price: props.part.outsource_info.heat_treat_price,
        wire_price: props.part.outsource_info.wire_price,
        material_client: props.part.outsource_info.material_client,
        milling_client: props.part.outsource_info.milling_client,
        heat_treat_client: props.part.outsource_info.heat_treat_client,
        wire_client: props.part.outsource_info.wire_client,
        material_client__name: props.part.outsource_info.material_client__name,
        milling_client__name: props.part.outsource_info.milling_client__name,
        heat_treat_client__name:
          props.part.outsource_info.heat_treat_client__name,
        wire_client__name: props.part.outsource_info.wire_client__name,
      });
    }
  }, []);

  return (
    <div className="mt-12">
      <div className="text-14 font-medium leading-1.14 text-palette-grey-menuicons">
        외주 추가하기
      </div>
      <div className="w-544 h-48 mt-8 item-border bg-palette-gray-osbox flex items-center justify-center">
        {OUTSOURCE.os_subjects.map((subject, index) => (
          <button
            key={index}
            className={`w-128 h-36 mx-6 item-border ${
              selectedOs.has(subject) ? 'onOsButton' : 'offOsButton'
            }`}
            onClick={() => manageSubject(subject)}
          >
            {(OUTSOURCE.os_subjects_dict as any)[subject]}
          </button>
        ))}
      </div>

      {OUTSOURCE.os_subjects.map((subject, index) => {
        if (selectedOs.has(subject) && props.part.outsource_info) {
          return (
            <OutSourceInput
              subject={subject}
              key={index}
              clientList={props.clientList}
              index={props.index}
              targetOutSourcePartList={props.targetOutSourcePartList}
              setTargetOutSourcePartList={props.setTargetOutSourcePartList}
              outSourceInfo={props.part.outsource_info}
            />
          );
        } else {
          return <div key={index} />;
        }
      })}
    </div>
  );
};

interface OutSourceInputProps {
  subject: string;
  clientList: ClientData[];
  index: number;
  targetOutSourcePartList: OutsourceData[];
  setTargetOutSourcePartList: Function;
  outSourceInfo: OutsourceData;
}

const OutSourceInput = (props: OutSourceInputProps) => {
  const onInputChange = <
    K extends keyof OutsourceData,
    V extends OutsourceData[K]
  >(
    key: K,
    value: V
  ) => {
    props.setTargetOutSourcePartList((prev: OutsourceData[]) => {
      let tmp = [...prev];
      tmp[props.index][key] = value;
      return tmp;
    });
  };

  return (
    <div className="mt-12 flex">
      <div className="w-256">
        <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
          {(OUTSOURCE.os_subjects_dict as any)[props.subject]} 업체 선택
        </div>
        <input
          className="os_drawer_input text-sm pl-12 two"
          placeholder={(OUTSOURCE.os_subjects_dict as any)[props.subject]}
          value={
            props.targetOutSourcePartList[props.index][
              `${props.subject}_client__name` as keyof OutsourceData
            ] || ''
          }
          onChange={e => {
            onInputChange(
              `${props.subject}_client` as keyof OutsourceData,
              getClientID(props.clientList, e.target.value)
            );
            onInputChange(
              `${props.subject}_client__name` as keyof OutsourceData,
              e.target.value
            );
          }}
          list={`patch-os-client-list-${props.index}`}
        />
        <datalist id={`patch-os-client-list-${props.index}`}>
          {props.clientList.map((client: ClientData) => {
            return <option key={client.id} value={client.name} />;
          })}
        </datalist>
      </div>
      <div className="w-256 ml-32">
        <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
          가격
        </div>
        <input
          className="w-full text-sm h-44 pl-12 rounded-8 bg-palette-purple-input"
          placeholder="내용을 입력하세요."
          value={
            (props.targetOutSourcePartList[props.index][
              `${props.subject}_price` as keyof OutsourceData
            ] as string) || ''
          }
          onChange={e => {
            onInputChange(
              `${props.subject}_price` as keyof OutsourceData,
              e.target.value
            );
          }}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps)(OutSource);
