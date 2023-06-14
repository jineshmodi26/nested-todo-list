import React from 'react';
import { createContext, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import PageNotFound from './Components/PageNotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const RouteGuard = React.lazy(() => import("./Components/RouteGuard"))

export const MyContext = createContext({})

const App : React.FC = () => {

  const [user, setUser] = useState<object>({})

  return (
    <MyContext.Provider value={{user, setUser}}>
      <div className="App">
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<RouteGuard><Dashboard /></RouteGuard>} />
            <Route path='/login' element={<Login />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </MyContext.Provider>
  );
}

export default App;
