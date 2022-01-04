import React, { useState } from 'react';

//router
import { useHistory } from 'react-router';

//types
import { ClientData } from '../../types';

//icons
import { ReactComponent as PinnedIcon } from '../../resources/pinned.svg';

//axios
import webClient from '../../utils/Webclient';

interface clientListProps {
  clientList: ClientData[];
  setCurrentTab: Function;
  getNavigationClientList: Function;
}

const ClientList = (props: clientListProps) => {
  const [isHoverPin, setIsHoverPin] = useState(false);
  const [currentClient, setCurrentClient] = useState('');
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
      {props.clientList?.map(c => (
        <div
          className={
            'flex items-center w-232 h-40 pl-10 cursor-pointer rounded-8' +
            (c.name === currentClient ? ' navigation-focus-tab' : '') +
            (!isHoverPin ? ' hover-tab' : '')
          }
          key={c.id}
        >
          <div
            onClick={() => {
              setCurrentClient(c.name);
              props.setCurrentTab('/client');
              history.push(`/client/part`);
            }}
            className="w-190"
          >
            <span className="navigation-client-item">{c.name}</span>
          </div>
          <PinnedIcon
            className={
              'pin-icon mr-25' + (c.is_pinned === 2 ? ' pinned-icon' : '')
            }
            onClick={() => {
              updateClientPin(c.id, c.is_pinned);
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
