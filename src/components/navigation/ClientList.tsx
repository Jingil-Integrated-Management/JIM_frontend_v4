import React, { useState } from 'react';

//router
import { useHistory } from 'react-router';

//types
import { ClientData } from '../../types';

//icons
import { ReactComponent as PinnedIcon } from '../../resources/svg/pinnedIcon.svg';

//axios
import webClient from '../../utils/Webclient';

interface clientListProps {
  clientList: ClientData[];
  setCurrentTab: Function;
  getNavigationClientList: Function;
  currentClient: number | null;
  setCurrentClient: Function;
}

const ClientList = (props: clientListProps) => {
  const [isHoverPin, setIsHoverPin] = useState(false);
  const history = useHistory();

  const updateClientPin = async (
    client: number | undefined,
    isPinned: number | undefined
  ) => {
    try {
      if (isPinned === 1) {
        await webClient.patch(`client/${client}`, {
          is_pinned: 2,
        });
      } else if (isPinned === 2) {
        await webClient.patch(`client/${client}`, {
          is_pinned: 1,
        });
      }
      props.getNavigationClientList();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {props.clientList?.map((client) => (
        <div
          className={
            'flex items-center w-232 h-40 pl-10 cursor-pointer rounded-8' +
            (client.id === props.currentClient ? ' navigation-focus-tab' : '') +
            (!isHoverPin ? ' hover-tab' : '')
          }
          key={client.id}
        >
          <div
            onClick={() => {
              props.setCurrentClient(client.id);
              props.setCurrentTab('/client');
              history.push(`/client/${client.id}/part`);
            }}
            className="w-190"
          >
            <span className="navigation-client-item">{client.name}</span>
          </div>
          <PinnedIcon
            className={
              'pin-icon mr-25' + (client.is_pinned === 2 ? ' pinned-icon' : '')
            }
            onClick={() => {
              updateClientPin(client.id, client.is_pinned);
            }}
            onMouseEnter={() => {
              setIsHoverPin(true);
            }}
            onMouseLeave={() => {
              setIsHoverPin(false);
            }}
          />
        </div>
      ))}
    </>
  );
};

export default ClientList;
