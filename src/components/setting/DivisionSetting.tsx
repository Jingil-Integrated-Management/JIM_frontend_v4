import { useState, useRef } from 'react';

//axios
import webClient from '../../utils/Webclient';
import { AxiosResponse } from 'axios';

//types
import { ClientData, DivisionData } from '../../types';

interface DivisionSettingProps {
  clientList: ClientData[];
}

const DivisionSetting = ({ clientList }: DivisionSettingProps) => {
  //selected client
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  //division list
  const [mainDivisionList, setMainDivisionList] = useState<
    { main_division: string }[]
  >([]);
  const [subDivisionList, setSubDivisionList] = useState<DivisionData[]>([]);

  //selected division id
  const [divisionIdToUpdate, setDivisionIdToUpdate] = useState<number | null>(
    null
  );

  //selected division
  const selectedMainDivision = useRef<HTMLInputElement>(null);
  const selectedSubDivision = useRef<HTMLInputElement>(null);

  //division input value
  const [mainDivisionInput, setMainDivisionInput] = useState<string | null>(
    null
  );
  const [subDivisionInput, setSubDivisionInput] = useState<string | null>(null);

  //validate
  const [isCorrectClient, setIsCorrectClient] = useState(false);
  const [isCorrectMainDivision, setIsCorrectMainDivision] = useState(false);
  const [isCorrectSubDivision, setIsCorrectSubDivision] = useState(false);

  const setCurrentClient = (name: string) => {
    const client = searchClient(name);

    if (client) {
      setSelectedClient(client);
    } else {
      setSelectedClient(null);
    }
  };

  const getMainDivisionList = async (
    clientToUpdate: ClientData | undefined
  ) => {
    if (clientToUpdate) {
      try {
        const response: AxiosResponse = await webClient.get(
          `division/main/?client=${clientToUpdate.id}`
        );
        setMainDivisionList(response.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      setMainDivisionList([]);
    }
  };

  const getSubDivisionList = async (mainDivisionName: string) => {
    if (
      selectedClient &&
      mainDivisionList.find(division =>
        searchMainDivision(division, mainDivisionName)
      )
    ) {
      try {
        const response: AxiosResponse = await webClient.get(
          `division/?client=${selectedClient.id}&main_division=${mainDivisionName}`
        );
        setSubDivisionList(response.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      setSubDivisionList([]);
    }
  };

  const searchDivisionId = (subDivisionName: string) => {
    let seachDivision: string | null = subDivisionName;

    if (subDivisionName === '???' || subDivisionName === '') {
      seachDivision = null;
    }

    const divisionToUpdate = subDivisionList.find(subDivision =>
      searchSubDivision(subDivision, seachDivision)
    );

    if (divisionToUpdate && divisionToUpdate.id) {
      setDivisionIdToUpdate(divisionToUpdate.id);
    } else {
      setDivisionIdToUpdate(null);
    }
  };

  const saveDivision = () => {
    const isUpdate =
      selectedMainDivision?.current?.value.length !== 0 ||
      selectedSubDivision?.current?.value.length !== 0;

    if (isUpdate) {
      validateUpdateDivision();
    } else {
      validateCreateDivision();
    }
  };

  const validateUpdateDivision = () => {
    if (selectedClient === null) {
      alert('????????? ????????? ????????? ?????? ??????????????????');
      return;
    }

    if (divisionIdToUpdate === null) {
      alert('????????? ????????? ?????? ????????? ?????? ????????? ?????? ??????????????????.');
      return;
    }

    if (window.confirm('????????? ?????????????????????????')) {
      updateDivision();
    }
  };

  const updateDivision = async () => {
    try {
      await webClient.patch(`division/${divisionIdToUpdate}`, {
        main_division: mainDivisionInput,
        sub_division: subDivisionInput,
      });
      if (window.confirm('??????????????? ?????????????????????.'))
        window.location.reload();
      else window.location.reload();
    } catch (error: any) {
      console.log(error);
      console.log(error.response);
    }
  };

  const validateCreateDivision = () => {
    if (selectedClient === null) {
      alert('????????? ????????? ????????? ?????? ??????????????????');
      return;
    }

    if (mainDivisionInput === null || mainDivisionInput === '') {
      alert('????????? ????????? ??????, ?????? ????????? ????????? ??????????????? ?????????.');
      return;
    }

    if (window.confirm('????????? ?????????????????????????')) {
      createDivision(selectedClient);
    }
  };

  const createDivision = async (selectedClient: ClientData) => {
    try {
      await webClient.post('division/', {
        main_division: mainDivisionInput,
        sub_division: subDivisionInput,
        client: selectedClient.id,
      });
      if (window.confirm('??????????????? ????????? ?????????????????????.'))
        window.location.reload();
      else window.location.reload();
    } catch (error: any) {
      if (error.response.data.message === 'This division already exists!') {
        alert('?????? ???????????? ???????????????!');
      }
      console.log(error.response.data.message);
    }
  };

  const validateDeleteDivision = () => {
    if (!selectedClient) {
      alert('????????? ???????????? ???????????????.');
      return;
    }

    if (
      selectedMainDivision?.current?.value.length === 0 ||
      selectedSubDivision?.current?.value.length === 0
    ) {
      alert('????????? ????????? ??????????????????.');
      return;
    }

    if (window.confirm('????????? ?????????????????????????')) {
      deleteDivision();
    }
  };

  const deleteDivision = async () => {
    try {
      await webClient.delete(`division/${divisionIdToUpdate}`);
      if (window.confirm('??????????????? ?????????????????????.'))
        window.location.reload();
      else window.location.reload();
    } catch (error: any) {
      alert('????????? ????????? ????????? ??????????????????.');
    }
  };

  const searchMainDivision = (
    division: { main_division: string },
    name: string
  ) => {
    return division.main_division === name;
  };

  const searchSubDivision = (
    subDivision: DivisionData,
    name: string | null
  ) => {
    return subDivision.sub_division === name;
  };

  const searchClient = (name: String) => {
    const clientToUpdate = clientList.find(client =>
      getClientDetail(client, name)
    );

    return clientToUpdate;
  };

  const getClientDetail = (client: ClientData, name: String) => {
    return client.name === name;
  };

  const isExistClient = (input: string) => {
    if (
      clientList.find(client => getClientDetail(client, input)) === undefined
    ) {
      return setIsCorrectClient(false);
    } else {
      return setIsCorrectClient(true);
    }
  };

  const isExistMainDivision = (input: string) => {
    if (
      mainDivisionList.find(division => searchMainDivision(division, input)) ===
      undefined
    ) {
      return setIsCorrectMainDivision(false);
    } else {
      return setIsCorrectMainDivision(true);
    }
  };

  const isExistSubDivision = (input: string) => {
    if (
      subDivisionList.find(division => searchSubDivision(division, input)) ===
      undefined
    ) {
      return setIsCorrectSubDivision(false);
    } else {
      return setIsCorrectSubDivision(true);
    }
  };

  const setNullableSubDivisionInput = (input: string) => {
    if (input.length === 0) {
      setSubDivisionInput(null);
    } else {
      setSubDivisionInput(input);
    }
  };

  return (
    <div className="mt-32">
      <div className="inline-block mb-16">
        <div className="client-name text-palette-black bg-palette-grey px-16 h-40 items-center flex">
          ?????? ????????????
        </div>
      </div>
      <div className="px-16">
        <div>
          <p className="group-text">?????? ????????????</p>
          <input
            className={
              'setting-input' +
              (isCorrectClient ? ' ' : ' incorrect-input-value')
            }
            list="setting-division-client-datalist"
            autoComplete="off"
            onChange={event => {
              isExistClient(event.target.value);
              setCurrentClient(event.target.value);
              getMainDivisionList(searchClient(event.target.value));
            }}
            placeholder="????????? ??????, ??????, ??????????????? ???????????????."
          />
          <datalist id="setting-division-client-datalist">
            {clientList?.map((client, index) => {
              return (
                <option
                  value={client.name}
                  key={`${index}-division-client-setting`}
                />
              );
            })}
          </datalist>
        </div>
        <div className="mt-4">
          <p className="group-text">?????? ?????? ????????????</p>
          <input
            className={
              'setting-input' +
              (isCorrectMainDivision ? ' ' : ' incorrect-input-value')
            }
            list="setting-main-division-datalist"
            autoComplete="off"
            onChange={event => {
              getSubDivisionList(event.target.value);
              setMainDivisionInput(event.target.value);
              isExistMainDivision(event.target.value);
            }}
            placeholder="????????? ??????, ??????????????? ???????????????."
            ref={selectedMainDivision}
          />
          <datalist id="setting-main-division-datalist">
            {mainDivisionList?.map((division, index) => {
              return (
                <option
                  value={division.main_division}
                  key={`${index}-main-division-setting`}
                />
              );
            })}
          </datalist>
        </div>
        <div className="mt-4">
          <p className="group-text">?????? ?????? ????????????</p>
          <input
            className={
              'setting-input' +
              (isCorrectSubDivision ? ' ' : ' incorrect-input-value')
            }
            list="setting-sub-division-datalist"
            autoComplete="off"
            onChange={event => {
              searchDivisionId(event.target.value);
              setSubDivisionInput(
                event.target.value !== '???' ? event.target.value : ''
              );
              isExistSubDivision(event.target.value);
            }}
            placeholder="????????? ??????, ??????????????? ???????????????."
            ref={selectedSubDivision}
          />
          <datalist id="setting-sub-division-datalist">
            {subDivisionList?.map((division, index) => {
              return (
                <option
                  value={division.sub_division || '???'}
                  key={`${index}-sub-division-setting`}
                />
              );
            })}
          </datalist>
        </div>
        <div className="mt-4">
          <p className="group-text">?????? ??????</p>
          <input
            className="setting-input"
            value={mainDivisionInput || ''}
            onChange={event => setMainDivisionInput(event.target.value)}
            placeholder="????????? ??????, ??????????????? ???????????????."
          />
        </div>
        <div className="mt-4">
          <p className="group-text">?????? ??????</p>
          <input
            className="setting-input"
            value={subDivisionInput || ''}
            onChange={event => setNullableSubDivisionInput(event.target.value)}
            placeholder="????????? ??????, ??????????????? ???????????????."
          />
        </div>
        <div className="mt-32 flex justify-end">
          <button
            className="setting-button group-text"
            onClick={validateDeleteDivision}
          >
            ????????????
          </button>
          <button
            className="setting-button group-text highlighted-button-text"
            onClick={saveDivision}
          >
            ????????????
          </button>
        </div>
      </div>
    </div>
  );
};

export default DivisionSetting;
