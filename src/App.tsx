import React from 'react';

//router
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/router/ProtectedRoute';

//pages
import Home from './pages/Home';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <div className="App">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="w-full h-full">
          <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute>
              <Route path="/" component={Home} />
            </ProtectedRoute>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
