import React, {Suspense, lazy,useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {
  PiCalendarCheckDuotone,
  PiFilesDuotone,
  PiChatCenteredDotsDuotone,
  PiPresentationDuotone,
} from 'react-icons/pi';
import Nav from './Nav';
import { useLoginState } from './Pages/signinpanel';
import Cookies from 'js-cookie';
import SignUp from './Pages/signinpanel';

const Homework = lazy(() => import('./Pages/Homework'));
const Schedule = lazy(() => import('./Pages/Schedule'));
const Comments = lazy(() => import('./Pages/Comments'));
const Display = lazy(() => import('./Pages/Display'));
const Home = lazy(() => import('./Pages/Home'));

const ICON_STL = 'w-7 h-7 text-neutral-600';

const pages = [
  {
    name: '主页',
    path: '/',
    component: Home,
    icon: <PiCalendarCheckDuotone className={ICON_STL} />,
  },
  {
    name: '课程表',
    path: '/schedule',
    component: Schedule,
    icon: <PiCalendarCheckDuotone className={ICON_STL} />,
  },
  {
    name: '作业',
    path: '/homework',
    component: Homework,
    icon: <PiFilesDuotone className={ICON_STL} />,
  },
  {
    name: '评论',
    path: '/comments',
    component: Comments,
    icon: <PiChatCenteredDotsDuotone className={ICON_STL} />,
  },
  {
    name: '展示',
    path: '/display',
    component: Display,
    icon: <PiPresentationDuotone className={ICON_STL} />,
  },
];


function App() {
  const {setLogin,setLoginForce} = useLoginState();
  useEffect(() => {
    console.log('uef')
    if (Cookies.get('access_token') && Cookies.get('unique_id')) {
      console.log('has cookie')
      sessionStorage.setItem('access_token', Cookies.get('access_token'));
      sessionStorage.setItem('unique_id', Cookies.get('unique_id'));
      sessionStorage.setItem('username', Cookies.get('username'));
      setLogin(true);
    }else {
      console.log('no cookie, setting login visible');
      setLoginForce(true);
    }
  }, []);
  return (
    <>
    <SignUp/>
        <Router>
      <div className='flex flex-col h-[100vh]'>
        <Nav pages={pages} />
        <div className='w-full h-full p-4 overflow-y-auto bg-neutral-100 md:p-5 lg:p-6 xl:p-8 2xl:p-10'>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {pages.map((page, index) => (
                <Route key={index} path={page.path} element={<page.component />} />
              ))}
            </Routes>
          </Suspense>
        </div>
      </div>
    </Router>
    
    </>

  );
}

export default App;
