import { useLayoutEffect, useState } from 'react';

//router
import { useHistory } from 'react-router';

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
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isClientListOpen, setIsClientListOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState('');
  const [clientList, setClientList] = useState<ClientData[]>([]);
  const history = useHistory();

  const getNaviList = async () => {
    try {
      const response: AxiosResponse = await webClient.get('navi/');
      setClientList(response.data as ClientData[]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (navigate: string) => {
    if (navigate === '/') {
      history.push('/');
      history.go(0);
    } else {
      if (navigate === 'dashboard') {
        history.push('/');
      } else {
        history.push(`/${navigate}`);
      }
      setCurrentTab(navigate);
      setIsClientListOpen(false);
      setCurrentClient('');
    }
  };

  useLayoutEffect(() => {
    getNaviList();
  }, []);

  return (
    <div id="navigation" className="flex flex-col pt-40 pb-40 pl-24 pr-24">
      <div
        className="cursor-pointer"
        onClick={() => {
          handleClick('/');
        }}
      >
        <Logo />
      </div>
      <div className="flex flex-col justify-between h-100p mt-100">
        <div className="flex flex-col">
          <div
            className={
              'w-232 h-40 flex items-center pl-10 cursor-pointer item-border hover-tab' +
              (currentTab === 'dashboard' ? ' focus-tab' : '')
            }
            onClick={() => {
              handleClick('dashboard');
            }}
          >
            <span>한눈에 보기</span>
          </div>
          <div
            className="w-232 h-40 flex items-center pl-10 cursor-pointer item-border justify-between"
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
              currentClient={currentClient}
              setCurrentClient={setCurrentClient}
              getNaviList={getNaviList}
            />
          ) : (
            <></>
          )}
          <div
            className={
              'w-232 h-40 flex items-center pl-10 cursor-pointer item-border hover-tab' +
              (currentTab === 'statistics' ? ' focus-tab' : '')
            }
            onClick={() => {
              handleClick('statistics');
            }}
          >
            <span>통계 확인하기</span>
          </div>
          <div
            className="w-232 h-40 flex items-center pl-10 cursor-pointer item-border hover-tab"
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
