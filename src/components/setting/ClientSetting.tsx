import { useState, useRef } from 'react';

//axios
import webClient from '../../utils/Webclient';

//types
import { ClientData } from '../../types';

interface ClientSettingProps {
  clientList: ClientData[];
}

const ClientSetting = ({ clientList }: ClientSettingProps) => {
  const [inputValue, setInputValue] = useState('');
  const currentClient = useRef<HTMLInputElement>(null);
  const [isCorrectValue, setIsCorrectValue] = useState(false);

  const saveClient = () => {
    if (!currentClient?.current?.value) {
      validateCreateClient();
    } else {
      validateUpdateClient();
    }
  };

  const validateCreateClient = () => {
    if (inputValue.length === 0) {
      alert('추가할 회사의 이름이 입력되지 않았습니다.');
      return;
    }

    if (window.confirm(`${inputValue}을(를) 추가하시겠습니까?`)) {
      createClient(inputValue);
    }
  };

  const createClient = async (name: String) => {
    try {
      await webClient.post('client/', {
        name: name,
      });
      if (window.confirm('성공적으로 회사가 추가되었습니다.'))
        window.location.reload();
      else window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const validateUpdateClient = () => {
    const clientToUpdate: ClientData | undefined =
      clientList.find(getClientDetail);

    if (clientToUpdate === undefined) {
      alert('수정할 회사의 이름을 정확히 선택해주세요.');
      return;
    }

    if (
      window.confirm(
        `${currentClient?.current?.value}을(를) ${inputValue}(으)로 바꾸시겠습니까?`
      )
    ) {
      if (clientToUpdate.id) {
        updateClient(clientToUpdate.id);
      }
    }
  };

  const updateClient = async (client_id: number) => {
    try {
      await webClient.patch(`client/${client_id}`, {
        name: inputValue,
      });
      if (window.confirm('성공적으로 변경되었습니다.'))
        window.location.reload();
      else window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const validateDeleteClient = () => {
    const clientToDelete = clientList.find(getClientDetail);

    if (clientToDelete === undefined) {
      alert('삭제할 회사를 정확히 선택해주세요.');
      return;
    }

    if (
      window.confirm(`${currentClient?.current?.value}을(를) 삭제하시겠습니까?`)
    ) {
      deleteClient(clientToDelete);
    }
  };

  const deleteClient = async (clientToDelete: ClientData) => {
    try {
      await webClient.delete(`client/${clientToDelete.id}`);
      if (window.confirm('성공적으로 삭제되었습니다.'))
        window.location.reload();
      else window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const getClientDetail = (client: ClientData) => {
    return client.name === currentClient?.current?.value;
  };

  const isExistClient = () => {
    if (clientList.find(getClientDetail) === undefined) {
      return setIsCorrectValue(false);
    } else {
      return setIsCorrectValue(true);
    }
  };

  return (
    <div className="mt-53 h-304">
      <div className="inline-block mb-16">
        <div className="client-name text-palette-black bg-palette-grey px-16 h-40 items-center flex">
          회사 관리하기
        </div>
      </div>
      <div className="px-16">
        <div>
          <p className="group-text">회사 선택하기</p>
          <input
            className={
              'setting-input' +
              (isCorrectValue ? ' ' : ' incorrect-input-value')
            }
            list="setting-client-list-datalist"
            autoComplete="off"
            ref={currentClient}
            onChange={event => {
              setInputValue(event.target.value);
              isExistClient();
            }}
            placeholder="회사를 수정, 삭제하려면 선택하세요."
          />
          <datalist id="setting-client-list-datalist">
            {clientList?.map((client, index) => {
              return <option value={client.name} key={`${index}-setting`} />;
            })}
          </datalist>
        </div>
        <div className="mt-4">
          <p className="group-text">회사명</p>
          <input
            className="setting-input"
            value={inputValue}
            onChange={event => {
              setInputValue(event.target.value);
            }}
            placeholder="회사를 추가, 수정하려면 입력하세요."
          />
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
            onClick={() => saveClient()}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientSetting;
