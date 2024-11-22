import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from './components/Loading';
import User from './pages/User';
import { PrivateRoute } from './components/PrivateRoute';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import NotFound from './pages/NotFound';
import Setting from './pages/Setting';
import EditUser from './pages/User/EditUser';
import { getLogo, getSystemName } from './helpers';
import PasswordResetForm from './components/PasswordResetForm';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import { UserContext } from './context/User';
import Channel from './pages/Channel';
import Token from './pages/Token';
import EditChannel from './pages/Channel/EditChannel';
import Redemption from './pages/Redemption';
import TopUp from './pages/TopUp';
import Log from './pages/Log';
import Chat from './pages/Chat';
import Guide from './pages/Guide';
import Chat2Link from './pages/Chat2Link';
import { Layout } from '@douyinfe/semi-ui';
import Midjourney from './pages/Midjourney';
import Pricing from './pages/Pricing/index.js';
import Task from "./pages/Task/index.js";
import Playground from './components/Playground.js';
import OAuth2Callback from "./components/OAuth2Callback.js";

const Home = lazy(() => import('./pages/Home'));
const Detail = lazy(() => import('./pages/Detail'));
const About = lazy(() => import('./pages/About'));

function App() {
  const [userState, userDispatch] = useContext(UserContext);
  // const [statusState, statusDispatch] = useContext(StatusContext);

  const loadUser = () => {
    let user = localStorage.getItem('user');
    if (user) {
      let data = JSON.parse(user);
      userDispatch({ type: 'login', payload: data });
    }
  };

  useEffect(() => {
    loadUser();
    let systemName = getSystemName();
    if (systemName) {
      document.title = systemName;
    }
    let logo = getLogo();
    if (logo) {
      let linkElement = document.querySelector("link[rel~='icon']");
      if (linkElement) {
        linkElement.href = logo;
      }
    }
  }, []);

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path='/channel'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}>  
				<PrivateRoute>
					<Channel />
				</PrivateRoute>
			</div>	
          }
        />
        <Route
          path='/channel/edit/:id'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}>  
				<Suspense fallback={<Loading></Loading>}>
					<EditChannel />
				</Suspense>
			</div>	
          }
        />
        <Route
          path='/channel/add'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}>  
				<Suspense fallback={<Loading></Loading>}>
					<EditChannel />
				</Suspense>
			</div>	
          }
        />
        <Route
          path='/token'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<PrivateRoute>
					<Token />
				</PrivateRoute>
			</div>	
          }
        />
        <Route
          path='/playground'
          element={
            <PrivateRoute>
              <Playground />
            </PrivateRoute>
          }
        />
        <Route
          path='/redemption'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<PrivateRoute>
					<Redemption />
				</PrivateRoute>
			</div>	
          }
        />
        <Route
          path='/user'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<PrivateRoute>
					<User />
				</PrivateRoute>
			</div>	
          }
        />
        <Route
          path='/user/edit/:id'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<Suspense fallback={<Loading></Loading>}>
					<EditUser />
				</Suspense>
			</div>	
          }
        />
        <Route
          path='/user/edit'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<Suspense fallback={<Loading></Loading>}>
					<EditUser />
				</Suspense>
			</div>	
          }
        />
        <Route
          path='/user/reset'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<Suspense fallback={<Loading></Loading>}>
					<PasswordResetConfirm />
				</Suspense>
			</div>	
          }
        />
        <Route
          path='/login'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<Suspense fallback={<Loading></Loading>}>
					<LoginForm />
				</Suspense>
			</div>	
          }
        />
        <Route
          path='/register'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<Suspense fallback={<Loading></Loading>}>
					<RegisterForm />
				</Suspense>
			</div>	
          }
        />
        <Route
          path='/reset'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<Suspense fallback={<Loading></Loading>}>
					<PasswordResetForm />
				</Suspense>
			</div>	
          }
        />
        <Route
          path='/oauth/github'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <OAuth2Callback type='github'></OAuth2Callback>
            </Suspense>
          }
        />
        <Route
          path='/oauth/linuxdo'
          element={
            <Suspense fallback={<Loading></Loading>}>
                <OAuth2Callback type='linuxdo'></OAuth2Callback>
            </Suspense>
          }
        />
        <Route
          path='/setting'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<PrivateRoute>
					<Suspense fallback={<Loading></Loading>}>
						<Setting />
					</Suspense>
				</PrivateRoute>
			</div>	
          }
        />
        <Route
          path='/topup'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<PrivateRoute>
					<Suspense fallback={<Loading></Loading>}>
						<TopUp />
					</Suspense>
				</PrivateRoute>
			</div>	
          }
        />
        <Route
          path='/log'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<PrivateRoute>
					<Log />
				</PrivateRoute>
			</div>	
          }
        />
        <Route
          path='/detail'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<PrivateRoute>
					<Suspense fallback={<Loading></Loading>}>
						<Detail />
					</Suspense>
				</PrivateRoute>
			</div>	
          }
        />
        <Route
          path='/midjourney'
          element={
            <PrivateRoute>
              <Suspense fallback={<Loading></Loading>}>
                <Midjourney />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path='/task'
          element={
            <PrivateRoute>
              <Suspense fallback={<Loading></Loading>}>
                <Task />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path='/pricing'
          element={
			<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}> 
				<div style={{  height: '100%', overflowY: 'auto', padding: '24px'  }}>
					<Suspense fallback={<Loading></Loading>}>
					<Pricing />
					</Suspense>
				</div>
			</div>	
          }
        />
        <Route
          path='/about'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <About />
            </Suspense>
          }
        />
		<Route
          path='/guide'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <Guide />
            </Suspense>
          }
        />
        <Route
          path='/chat/:id?'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <Chat />
            </Suspense>
          }
        />
        {/* 方便使用chat2link直接跳转聊天... */}
          <Route
            path='/chat2link'
            element={
              <PrivateRoute>
                <Suspense fallback={<Loading></Loading>}>
                    <Chat2Link />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </>
  );
}

export default App;
