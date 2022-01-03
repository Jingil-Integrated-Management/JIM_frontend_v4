import React from 'react';

//router
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/router/ProtectedRoute';

//pages
import Home from './pages/Home';
import Login from './pages/Login';

//redux
import rootReducer from './redux/reducer/index';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const store = createStore(rootReducer);

const App: React.FC = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
