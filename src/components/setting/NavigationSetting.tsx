import { useState, useEffect } from 'react';

//axios
import webClient from '../../utils/Webclient';
import { AxiosResponse } from 'axios';

//types
import { ClientData } from '../../types';

interface NavigationSettingProps {
  clientList: ClientData[];
}

const NavigationSetting = ({ clientList }: NavigationSettingProps) => {
  const [pinnedClientList, setPinnedClientList] = useState<ClientData[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [clickedClient, setClickedClient] = useState('');
  const [isCorrectValue, setIsCorrectValue] = useState(false);

  const validateAddClient = () => {
    if (selectedClient.length === 0) {
      alert('선택된 회사가 없습니다.');
      return;
    }

    const clientToAdd = clientList.find(client =>
      getClientDetail(client, selectedClient)
    );

    if (clientToAdd === undefined) {
      alert('추가할 회사를 정확히 선택해주세요.');
      return;
    } else if (clientToAdd.is_pinned !== 0) {
      alert('이미 목록에 존재하는 회사입니다.');
      return;
    }

    if (window.confirm(`${selectedClient}을(를) 목록에 추가하시겠습니까?`)) {
      addClient(clientToAdd);
    }
  };

  const addClient = async (clientToAdd: ClientData) => {
    try {
      await webClient
        .patch(`client/${clientToAdd.id}`, {
          is_pinned: 1,
        })
        .then(() => {
          getPinnedClientList();
        });
      setTimeout(() => {
        if (window.confirm('성공적으로 추가되었습니다.'))
          window.location.reload();
        else window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  const validateDeleteClient = () => {
    if (selectedClient.length === 0) {
      alert('선택된 회사가 없습니다.');
      return;
    }

    const clientToDelete = clientList.find(client =>
      getClientDetail(client, selectedClient)
    );

    if (clientToDelete === undefined) {
      alert('제거할 회사를 정확히 선택해주세요.');
      return;
    } else if (clientToDelete.is_pinned === 0) {
      alert('현재 목록에 이미 존재하지 않는 회사입니다.');
      return;
    }

    if (window.confirm(`${selectedClient}을(를) 목록에서 제거하시겠습니까?`)) {
      deleteClient(clientToDelete);
    }
  };

  const deleteClient = async (clientToDelete: ClientData) => {
    try {
      await webClient
        .patch(`client/${clientToDelete.id}`, {
          is_pinned: 0,
        })
        .then(() => {
          getPinnedClientList();
        });
      setTimeout(() => {
        if (window.confirm('성공적으로 제거되었습니다.'))
          window.location.reload();
        else window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  const getClientDetail = (client: ClientData, currentInput: string) => {
    return client.name === currentInput;
  };

  const isExistClient = (input: string) => {
    if (
      clientList.find(client => getClientDetail(client, input)) === undefined
    ) {
      return setIsCorrectValue(false);
    } else {
      return setIsCorrectValue(true);
    }
  };

  const getPinnedClientList = async () => {
    try {
      const response: AxiosResponse = await webClient.get('navi/');
      setPinnedClientList(response.data as ClientData[]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPinnedClientList();
    return () => {};
  }, []);

  return (
    <div className="mt-32">
      <div className="inline-block mb-16">
        <div className="client-name text-palette-black bg-palette-grey px-16 h-40 items-center flex">
          목록 관리하기
        </div>
      </div>
      <div className="px-16">
        <div>
          <p className="group-text">회사 선택하기</p>
          <input
            className={
              'setting-input' + (isCorrectValue ? '' : ' incorrect-input-value')
            }
            list="setting-navigation-list-datalist"
            autoComplete="off"
            onChange={event => {
              setSelectedClient(event.target.value);
              isExistClient(event.target.value);
            }}
            placeholder="목록에 회사를 추가, 삭제하려면 선택하세요."
          />
          <datalist id="setting-navigation-list-datalist">
            {clientList?.map((client, index) => {
              return (
                <option
                  value={client.name}
                  key={`${index}-navigation-setting`}
                />
              );
            })}
          </datalist>
        </div>
        <div className="mt-4">
          <p className="group-text">회사 목록</p>
          <div className="client-list-box">
            {pinnedClientList?.map(client => (
              <div
                className={
                  'h-48 flex items-center pl-20 cursor-pointer client-list-item-text client-list-item-hover' +
                  (clickedClient === client.name ? ' clicked-list-item' : '')
                }
                key={client.name + 'setting'}
                onClick={() => {
                  setClickedClient(client.name);
                  setSelectedClient(client.name);
                }}
              >
                {client.name}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-32 flex justify-end">
          <button
            className="setting-button group-text"
            onClick={() => validateDeleteClient()}
          >
            삭제하기
          </button>
          <button
            className="setting-button group-text highlighted-button-text"
            onClick={() => validateAddClient()}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationSetting;
