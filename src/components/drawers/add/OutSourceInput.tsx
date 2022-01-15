import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

//types
import { OutsourceData, ClientData } from '../../../types';

//utils
import getClientID from '../../../utils/getClientID';

import OUTSOURCE from '../../../constants/OUTSOURCE.json';
import getClientName from '../../../utils/getClientName';

interface outSourceControlProps {
  osParts: OutsourceData[];
  setOsParts: Function;
  index: number;
  clientList: ClientData[];
  subject: string;
}

interface outSourceInputProps {
  osParts: OutsourceData[];
  setOsParts: Function;
  index: number;
  clientList: ClientData[];
}

const OutSourceControl = (props: outSourceControlProps) => {
  const onInputChange = <
    K extends keyof OutsourceData,
    V extends OutsourceData[K]
  >(
    key: K,
    value: V
  ) => {
    props.setOsParts((prevOsParts: OutsourceData[]) => {
      let tmpOsParts = [...prevOsParts];
      tmpOsParts[props.index][key] = value;
      return tmpOsParts;
    });
  };

  useEffect(() => {
    return () => {
      onInputChange((props.subject + '_price') as keyof OutsourceData, null);
      onInputChange((props.subject + '_client') as keyof OutsourceData, null);
    };
  }, []);

  return (
    <div className="mt-12 flex">
      <div className="w-256">
        <div className="text-sm font-medium leading-1.14 text-palette-grey-menuicons">
          {(OUTSOURCE.os_subjects_dict as any)[props.subject]} 업체 선택
        </div>
        <input
          className="os_drawer_input text-sm pl-12 two"
          placeholder={(OUTSOURCE.os_subjects_dict as any)[props.subject]}
          value={getClientName(
            props.clientList,
            props.osParts[props.index][
              (props.subject + '_client') as keyof OutsourceData
            ] as number
          )}
          onChange={e => {
            onInputChange(
              (props.subject + '_client') as keyof OutsourceData,
              getClientID(props.clientList, e.target.value)
            );
          }}
          autoComplete="off"
          list={`osClientList${props.index}`}
        />
        <datalist id={`osClientList${props.index}`}>
          <option value="">회사 선택</option>
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
            (props.osParts[props.index][
              (props.subject + '_price') as keyof OutsourceData
            ] as string) || ''
          }
          onChange={e => {
            onInputChange(
              (props.subject + '_price') as keyof OutsourceData,
              e.target.value
            );
          }}
        />
      </div>
    </div>
  );
};

const OutSourceInput = (props: outSourceInputProps) => {
  const [selectedOs, setSelectedOs] = useState<Set<string>>(new Set());

  useEffect(() => {}, [props.osParts]);

  return (
    <div className="mt-12">
      <div className="text-14 font-medium leading-1.14 text-palette-grey-menuicons">
        외주 추가하기
      </div>
      <div className="w-544 h-48 mt-8 rounded-8 item-border bg-palette-purple-input flex items-center justify-center">
        {OUTSOURCE.os_subjects.map((subject, index) => {
          return (
            <button
              key={index}
              className={`w-128 h-36 mx-6 item-border ${
                selectedOs.has(subject) ? 'onOsButton' : 'offOsButton'
              }`}
              onClick={() => {
                const tmpSelectdOs = new Set(selectedOs);
                tmpSelectdOs.has(subject)
                  ? tmpSelectdOs.delete(subject)
                  : tmpSelectdOs.add(subject);
                setSelectedOs(tmpSelectdOs);
              }}
            >
              {(OUTSOURCE.os_subjects_dict as any)[subject]}
            </button>
          );
        })}
      </div>
      {OUTSOURCE.os_subjects.map((subject, index) => {
        if (selectedOs.has(subject))
          return (
            <OutSourceControl
              key={index}
              osParts={props.osParts}
              setOsParts={props.setOsParts}
              index={props.index}
              subject={subject}
              clientList={props.clientList}
            />
          );
      })}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps)(OutSourceInput);
