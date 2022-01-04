import { useState } from 'react';

//components
import Navigation from '../components/navigation/Navigation';
import TopNavigation from '../components/navigation/TopNavigation';
import Dashboard from '../components/dashboard/Dashboard';
import Client from '../components/client/Client';
import Statistics from '../components/statistics/Statistics';
import Setting from '../components/setting/Setting';

//router
import { Switch, Route } from 'react-router-dom';

const Home = () => {
  const [openSetting, setOpenSetting] = useState<boolean>(false);
  const [drawerHide, setDrawerShow] = useState<string>('hidden');

  return (
    <>
      <div className="w-full h-full flex">
        <Navigation openSetting={openSetting} setOpenSetting={setOpenSetting} />
        <div
          id="home-content"
          className="flex justify-center flex-col items-center"
        >
          <TopNavigation setDrawerShow={setDrawerShow} />
          <Switch>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route path="/client">
              <Client />
            </Route>
            <Route path="/statistics">
              <Statistics />
            </Route>
          </Switch>
        </div>
      </div>
      <Setting open={openSetting} setOpen={setOpenSetting} />
    </>
  );
};

export default Home;
