import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import composeWithDevTools from 'redux-devtools-extension';
import { Route, BrowserRouter, Redirect, Switch} from 'react-router-dom';
import './App.css';

// pages
import HomePage from './HomePage';
import MapPage from './MapPage';

// store
import { appReducer } from '../stores';

export const App = () => {

    const store = createStore(appReducer, applyMiddleware(thunkMiddleware));

    return (
        <Provider store={store}>
            <div className='app-container'>
                <BrowserRouter>
                    <Switch>
                        <Route component={HomePage} exact path={'/'}/>
                        <Route component={MapPage} path={'/map'}/>
                        <Redirect to={'/'}/>
                    </Switch>
                </BrowserRouter>
            </div>
        </Provider>
    );
};

export default App;
