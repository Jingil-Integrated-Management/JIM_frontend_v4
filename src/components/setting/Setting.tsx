import { useState, useEffect } from 'react';

//drawer
import Drawer from '@mui/material/Drawer';

//icons
import CloseIcon from '@mui/icons-material/Close';

//axios
import webClient from '../../utils/Webclient';
import { AxiosResponse } from 'axios';

//types
import { ClientData } from '../../types';

//components
import ClientSetting from './ClientSetting';
import NavigationSetting from './NavigationSetting';
import DivisionSetting from './DivisionSetting';

interface SettingProps {
  open: boolean;
  setOpen: Function;
}

const Setting = ({ open, setOpen }: SettingProps) => {
  const [clientList, setClientList] = useState<ClientData[]>([]);

  useEffect(() => {
    const getClientList = async () => {
      try {
        const response: AxiosResponse = await webClient.get(`client/`);
        setClientList(response.data as ClientData[]);
      } catch (error) {
        console.log(error);
      }
    };

    getClientList();
  }, []);

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <div className="w-608 px-32 py-40">
        <div className="flex items-center justify-between">
          <span className="title-text">설정하기</span>
          <CloseIcon
            fontSize="small"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
        <ClientSetting clientList={clientList} />
        <NavigationSetting clientList={clientList} />
        <DivisionSetting clientList={clientList} />
      </div>
    </Drawer>
  );
};

export default Setting;
