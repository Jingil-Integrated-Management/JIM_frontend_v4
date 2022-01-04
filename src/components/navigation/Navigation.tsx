import { useEffect, useState } from 'react';

//router
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

//icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ReactComponent as Logo } from '../../resources/jim_logo.svg';

//axios
import webClient from '../../utils/Webclient';
import { AxiosResponse } from 'axios';

//types
import { ClientData } from '../../types';

//components
import ClientList from './ClientList';

interface NavigationProps {
  openSetting: boolean;
  setOpenSetting: Function;
}

const Navigation = ({ openSetting, setOpenSetting }: NavigationProps) => {
  const [currentTab, setCurrentTab] = useState<string>('/');
  const [currentClient, setCurrentClient] = useState<string>('');
  const [isClientListOpen, setIsClientListOpen] = useState<boolean>(false);
  const [clientList, setClientList] = useState<ClientData[]>([]);
  const history = useHistory();
  const location = useLocation();

  const getNavigationClientList = async () => {
    try {
      const response: AxiosResponse = await webClient.get('navi/');
      setClientList(response.data as ClientData[]);
    } catch (error) {
      console.log(error);
    }
  };

  const route = (current: string) => {
    history.push(current);
    setCurrentTab(current);
    setIsClientListOpen(false);
  };

  useEffect(() => {
    getNavigationClientList();
  }, []);

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname === '/') {
      setCurrentTab('/');
    } else if (location.pathname.includes('client')) {
      setCurrentTab('/client');
      setIsClientListOpen(true);
      // TODO : 특정 클라이언트 포커스
    } else if (location.pathname.includes('statistics')) {
      setCurrentTab('/statistics');
    }
  }, [location]);

  return (
    <div
      id="navigation-container"
      className="flex flex-col w-280 pt-40 pb-40 pl-24 pr-24"
    >
      <div
        className="cursor-pointer"
        onClick={() => {
          route('/');
          history.go(0);
        }}
      >
        <Logo />
      </div>
      <div className="flex flex-col justify-between h-100p mt-100">
        <div className="flex flex-col">
          <div
            className={
              'flex items-center w-232 h-40 pl-10 cursor-pointer hover:bg-palette-grey-2-hover rounded-8' +
              (currentTab === '/' ? ' navigation-focus-tab' : '')
            }
            onClick={() => {
              route('/');
            }}
          >
            <span>한눈에 보기</span>
          </div>
          <div
            className="flex justify-between items-center w-232 h-40 pl-10 cursor-pointer rounded-8"
            onClick={() => setIsClientListOpen(!isClientListOpen)}
          >
            <span>회사별로 보기</span>
            {isClientListOpen ? (
              <KeyboardArrowUpIcon fontSize="small" className="mr-23" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" className="mr-23" />
            )}
          </div>

          {isClientListOpen ? (
            <ClientList
              clientList={clientList}
              setCurrentTab={setCurrentTab}
              getNavigationClientList={getNavigationClientList}
              currentClient={currentClient}
              setCurrentClient={setCurrentClient}
            />
          ) : (
            <></>
          )}
          <div
            className={
              'w-232 h-40 flex items-center pl-10 cursor-pointer rounded-8 hover:bg-palette-grey-2-hover' +
              (currentTab === '/statistics' ? ' navigation-focus-tab' : '')
            }
            onClick={() => {
              route('/statistics');
            }}
          >
            <span>통계 확인하기</span>
          </div>
          <div
            className="flex items-center w-232 h-40 pl-10 cursor-pointer rounded-8 hover:bg-palette-grey-2-hover"
            onClick={() => {
              setOpenSetting(!openSetting);
            }}
          >
            <span>설정하기</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
