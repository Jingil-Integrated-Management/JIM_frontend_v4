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
  currentClient: string;
  setCurrentClient: Function;
  getNaviList: Function;
}

const ClientList = (props: clientListProps) => {
  const [isHoverPin, setIsHoverPin] = useState(false);
  const history = useHistory();

  const updateClientPin = async (client: number, isPinned: number) => {
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
      props.getNaviList();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {props.clientList?.map(c => (
        <div
          className={
            'h-40 w-232 pl-10 flex items-center cursor-pointer item-border' +
            (c.name === props.currentClient ? ' focus-tab' : '') +
            (!isHoverPin ? ' hover-tab' : '')
          }
          key={c.id}
        >
          <div
            onClick={() => {
              props.setCurrentTab('client');
              props.setCurrentClient(c.name);
              history.push(`/client`);
            }}
            className="w-190"
          >
            <span className="client-item">{c.name}</span>
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
