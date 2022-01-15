import React, { useState } from 'react';

//types
import { ClientData } from '../../types';

//utils
import getClientID from '../../utils/getClientID';

interface statsProps {
  clientList: ClientData[];
  openFilter: boolean;
  clientId: number;
  setClient: Function;
  setOpenFilter: Function;
}

const StatsFilter = (props: statsProps) => {
  const [selectedClient, setSelectedClient] = useState<string>('');

  const applyFilter = () => {
    props.setClient(getClientID(props.clientList, selectedClient));
  };

  return (
    <div className="stats_filter_container flex flex-col relative">
      <div className="filter_title flex ml-16 mt-16"> 회사 설정하기</div>
      <div>
        <input
          className="drawer_input flex ml-16 mt-14"
          list="client-datalist"
          placeholder="회사명"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedClient(e.target.value);
          }}
        />
        <datalist id="client-datalist">
          {props.clientList?.map((client: ClientData, index) => {
            return <option key={index.toString()} value={client.name} />;
          })}
        </datalist>
      </div>
      <div className="flex flex-row">
        <button
          className="modal-button text-palette-modal-black ml-120 mt-33 h-40 w-76 flex items-center text-sm font-medium justify-center"
          onClick={() => {
            props.setOpenFilter(!props.openFilter);
          }}
        >
          취소하기
        </button>
        <button
          className="modal-button text-palette-button-sub mt-33 h-40 w-76 flex flex-row items-center text-sm font-medium justify-center"
          onClick={() => {
            applyFilter();
            props.setOpenFilter(!props.openFilter);
          }}
        >
          적용하기
        </button>
      </div>
    </div>
  );
};

export default StatsFilter;
