import { useEffect, useState } from 'react';

//axios
import { AxiosResponse } from 'axios';
import webClient from '../../utils/Webclient';

//router
import { RouteProps, Route, Redirect } from 'react-router-dom';
import Loading from './Loading';

const ProtectedRoute = ({ ...routeProps }: RouteProps) => {
  const [isAuth, setIsAuth] = useState<boolean | undefined>(undefined);

  const check = async () => {
    const access = localStorage.getItem('access');
    const refresh = localStorage.getItem('refresh');

    if (!access) setIsAuth(false);
    else {
      try {
        await webClient.get('client/1');
        setIsAuth(true);
      } catch (error) {
        try {
          let response: AxiosResponse = await webClient.post('auth/refresh/', {
            refresh: refresh,
          });
          localStorage.setItem('access', response.data.access);
          setIsAuth(true);
        } catch (error) {
          setIsAuth(false);
        }
      }
    }
  };

  useEffect(() => {
    check();
  }, []);

  if (isAuth === undefined) return <Loading />;
  else if (isAuth === false) return <Redirect to="/login" />;
  else return <Route {...routeProps} />;
};

export default ProtectedRoute;
