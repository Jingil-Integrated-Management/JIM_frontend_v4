import { useEffect, useState } from 'react';

import { ClientData } from '../../types';

import webClient from '../../utils/Webclient';
import { AxiosResponse } from 'axios';

import Drawer from '@mui/material/Drawer';

import DrawingTable from '../tables/DrawingTable';
import { DashboardEmpty } from '../tables/EmptyTable';

const Dashboard = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [dashboardClientList, setDashboardClientList] = useState<ClientData[]>(
    []
  );

  const closeDrawer = () => setOpen(false);
  useEffect(() => {
    const getDashboardClients = async () => {
      try {
        const response: AxiosResponse = await webClient.get('dashboard/');
        setDashboardClientList(response.data as ClientData[]);
      } catch (error) {
        console.log(error);
      }
    };
    getDashboardClients();
  }, []);

  return (
    <div
      id="dashboard-container"
      className="flex h-100p w-100p overflow-hidden justify-center"
    >
      <div
        id="dashboard-content"
        className="flex flex-col items-center justify-start h-100p w-100p overflow-scroll scroll-hide"
      >
        {dashboardClientList?.length === 0 ? (
          <div className="w-100p h-700">
            <DashboardEmpty />
          </div>
        ) : (
          <>
            {dashboardClientList?.map((data: ClientData) => (
              <div className="flex w-100p mb-18" key={data.id}>
                <DrawingTable
                  clientId={data.id ? data.id : 0}
                  type="dashboard"
                />
              </div>
            ))}
          </>
        )}
      </div>
      {open ? (
        <Drawer
          anchor="right"
          open={open}
          ModalProps={{ onBackdropClick: closeDrawer }}
        ></Drawer>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Dashboard;
