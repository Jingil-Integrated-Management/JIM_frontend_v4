import React, { useState, useEffect } from 'react';

//icons
import { ReactComponent as SearchIcon } from '../../resources/Vector-1.svg';
import { ReactComponent as AddIcon } from '../../resources/Vector.svg';
import logo from '../../resources/jingil_logo.png';

//router
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

//types
import { ClientData } from '../../types';

//redux
import { connect } from 'react-redux';

interface topNaviProps {
  drawerModified: boolean;
  setDrawerOpen: Function;
  clientList: ClientData[];
}

interface tableToggleProps {
  current: string | undefined;
  setCurrent: Function;
}

interface SearchProps {
  clientList: ClientData[];
}

const TopNavigation = (props: topNaviProps) => {
  const [current, setCurrent] = useState<string>('');
  const { clientList } = props;
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('client')) {
      setCurrent('client');
    } else if (location.pathname.includes('statistics')) {
      setCurrent('statistics');
    } else {
      setCurrent('dashboard');
    }
  }, [location, props]);

  return (
    <div className="flex w-100p justify-center bg-white pt-32 pb-26">
      <div className="flex h-44 items-center justify-between top-navigation">
        {current === 'client' ? (
          <ClientTableToggle current={current} setCurrent={setCurrent} />
        ) : (
          <p className="current-focus-text pl-16">
            {current === 'dashboard' ? '한눈에 보기' : '통계 확인하기'}
          </p>
        )}

        <div className="flex items-center">
          <Search clientList={clientList} />
          <button
            className="w-44 h-44 flex justify-center items-center rounded-8 icon-button cursor-pointer relative"
            onClick={() => props.setDrawerOpen(true)}
          >
            <AddIcon />
            {props.drawerModified && (
              <div className="bg-palette-alert-red w-5 h-5 absolute top-10 right-10 rounded-20"></div>
            )}
          </button>
          <div className="w-44 h-44 flex justify-center items-center rounded-8">
            <img src={logo} alt="AD"></img>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientTableToggle = (props: tableToggleProps) => {
  const [currentView, setCurrentView] = useState('part');
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('/part')) {
      setCurrentView('part');
    } else if (location.pathname.includes('/drawing')) {
      setCurrentView('drawing');
    }
  }, [props, location]);

  const parseClientId = (path: string) => {
    const clientId = path.split('/')[2];

    return clientId;
  };

  const route = (route: string) => {
    const clientId = parseClientId(location.pathname);

    if (route === 'part') {
      history.push(`/client/${clientId}/part`);
    } else if (route === 'drawing') {
      history.push(`/client/${clientId}/drawing`);
    }
  };

  return (
    <div className="flex h-44 items-center">
      <div
        onClick={() => route('part')}
        className="flex items-center cursor-pointer p-16 h-44 hover-toggle-tab"
      >
        <span
          className={
            '' +
            (currentView === 'part' ? ' current-focus-text' : ' unfocus-text')
          }
        >
          파트별로 보기
        </span>
      </div>
      <div
        onClick={() => route('drawing')}
        className="flex items-center cursor-pointer p-16 h-44 hover-toggle-tab"
      >
        <span
          className={
            '' +
            (currentView === 'drawing'
              ? ' current-focus-text'
              : ' unfocus-text')
          }
        >
          도면별로 보기
        </span>
      </div>
    </div>
  );
};

const Search = (props: SearchProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const history = useHistory();

  const getClientDetail = (client: ClientData) => {
    return client.name === inputValue;
  };

  const searchButtonEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchButtonClick();
    }
  };

  const searchButtonClick = () => {
    if (isSearchOpen === false) setIsSearchOpen(true);
    else {
      if (inputValue !== '') {
        routingToClient();
      } else setIsSearchOpen(false);
    }
  };

  const routingToClient = () => {
    const searchedClient = props.clientList.find(getClientDetail);

    if (searchedClient) {
      history.push(`/client/${searchedClient?.id}/part`);
      setInputValue('');
      setIsSearchOpen(false);
    } else {
      alert('존재하지 않는 회사입니다.');
    }
  };

  return (
    <div
      className={
        '' +
        (isSearchOpen
          ? ' search-open flex items-center w-240 h-44 rounded-15 pl-16 pr-10 duration-300'
          : '')
      }
    >
      {isSearchOpen ? (
        <>
          <input
            list="client-search-list"
            name="client-search-list"
            id="client-list-input"
            autoComplete="off"
            className="search-input-text"
            placeholder="검색하기"
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            onKeyPress={searchButtonEnter}
          />
          <datalist id="client-search-list">
            {props.clientList?.map((client, index) => {
              return <option value={client.name} key={`${index}`} />;
            })}
          </datalist>
        </>
      ) : (
        <></>
      )}
      <div
        className={
          'w-40 h-40 ml-4 flex justify-center items-center rounded-8' +
          (!isSearchOpen ? ' icon-button' : '')
        }
      >
        <SearchIcon className="cursor-pointer" onClick={searchButtonClick} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  clientList: state.clientReducer.clientList,
});

export default connect(mapStateToProps)(TopNavigation);
