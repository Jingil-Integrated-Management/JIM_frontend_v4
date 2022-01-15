import { useState } from 'react';

import Navigation from '../components/navigation/Navigation';
import TopNavigation from '../components/navigation/TopNavigation';
import Dashboard from '../components/dashboard/Dashboard';
import Client from '../components/client/Client';
import Statistics from '../components/statistics/Statistics';
import Setting from '../components/setting/Setting';

import Drawer from '@mui/material/Drawer';
import AddDrawing from '../components/drawers/add/AddDrawing';
import { Switch, Route } from 'react-router-dom';

const Home = () => {
  const [openSetting, setOpenSetting] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerModified, setDrawerModified] = useState<boolean>(false);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <div className="w-full h-full flex">
        <Navigation openSetting={openSetting} setOpenSetting={setOpenSetting} />
        <div
          id="home-content"
          className="flex justify-center flex-col items-center"
        >
          <TopNavigation
            drawerModified={drawerModified}
            setDrawerOpen={setDrawerOpen}
          />
          <Switch>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route path="/client/:id">
              <Client />
            </Route>
            <Route path="/statistics">
              <Statistics />
            </Route>
          </Switch>
          <Drawer
            anchor="right"
            open={true}
            className={drawerOpen ? '' : 'hidden'}
            ModalProps={{ onBackdropClick: closeDrawer }}
          >
            <AddDrawing
              setDrawerModified={setDrawerModified}
              setOpen={closeDrawer}
            />
          </Drawer>
        </div>
      </div>
      <Setting open={openSetting} setOpen={setOpenSetting} />
    </>
  );
};

export default Home;
