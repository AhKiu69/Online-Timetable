import React, {useState} from 'react';
import axios from 'axios';
import {create} from 'zustand';
import Cookies from 'js-cookie';
import {ColoredBtn, InputField} from '../Components/Elements';
import {SeverLink} from '../Link';

function SetCookieNSession(access_token, unique_id, username) {
  sessionStorage.setItem('access_token', access_token);
  sessionStorage.setItem('unique_id', unique_id);
  // 设置cookie，过期时间为8小时（28800秒）
  Cookies.set('access_token', access_token, {expires: 7});
  Cookies.set('unique_id', unique_id, {expires: 7});
  Cookies.set('username', username, {expires: 7});
}
function setRole2Teacher() {
  Cookies.set('role', 'teacher', {expires: 7});
}

export const useLoginState = create((set) => ({
  isLogin: false,
  isLoginVisible: false,
  setLogin: (value) => set(() => ({isLogin: value})),
  setLoginForce: (value) => set(() => ({isLoginVisible: value})),
  setLoginVisible: () => set((state) => ({isLoginVisible: !state.isLoginVisible})),
}));


export const useRoleStore = create((set) => ({
  userRole:  Cookies.get('role') || 'student',
  setUserRole: (userRole) => set({userRole}),
  user: Cookies.get('username') || '',
  setUser: (value) => set(() => ({user: value})),
}));

const SignUp = () => {
  const {isLoginVisible, setLoginVisible} = useLoginState();
  const [LoginSignup, setLoginSignup] = useState(true);
  const LoginHandle = (event) => {
    setLoginVisible(false);
  };

  return isLoginVisible ? (
    <div>
      <div className='fixed z-50 flex items-center justify-center w-screen h-screen select-none'>
        <div className='w-[350px] fixed rounded-md z-50 bg-white text-neutral-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] border border-neutral-400 p-8 flex flex-col gap-4'>
          <h2 className='z-50 flex justify-between text-2xl font-medium text-neutral-800 '>
            {LoginSignup ? '立即登录' : '立即注册'}
            <button
              className='text-sm font-light hover:underline'
              onClick={() => setLoginSignup(!LoginSignup)}>
              {LoginSignup ? '切换到注册' : '切换到登录'}
            </button>
          </h2>
          {LoginSignup ? <LoginNormal /> : <SignUpNormal />}
        </div>
        <div className='fixed z-40 w-screen h-screen backdrop-blur-sm' onClick={LoginHandle} />
      </div>
    </div>
  ) : null;
};

export default SignUp;

const SignUpNormal = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const {setLogin, setLoginVisible} = useLoginState();
  const {setUser} = useRoleStore();

  const handleRegister = async () => {
    if (password.length <= 4) {
      alert('密码必须大于4位');
      // setAlert(true, '密码必须大于4位', 'alert', true);
      return;
    }
    if (phone.length != 11) {
      alert('请输入正确的手机号');
      return;
    }

    const data = {
      username,
      phone,
      password,
    };

    try {
      const response = await axios.post(`http://${SeverLink}/api/register`, data);

      const responseData = response.data;
      console.log(responseData);
      if (response.data.status === 'error') {
        alert(response.data.errMsg);
      } else {
        setLogin(true);
        setLoginVisible(false);
        let access_token = response.data.access_token;
        let unique_id = response.data.unique_id;
        SetCookieNSession(access_token, unique_id, response.data.name);
        setUser(response.data.name);
        window.location.reload(); // 强制
      }
    } catch (error) {
      console.error(error);
      alert("注册失败");
      // setAlert(true, '注册失败', 'alert', true);
    }
  };

  return (
    <div className='z-50 flex flex-col gap-4'>
      <InputField
        label='学生名'
        type='text'
        placeholder='请输入学生的姓名'
        onChange={(e) => setUsername(e.target.value)}
      />
      <InputField
        label='手机号'
        type='phone'
        placeholder='请输入手机号'
        onChange={(e) => setPhone(e.target.value)}
      />
      <InputField
        label='密码'
        type='password'
        placeholder='请输入密码'
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className='flex items-center justify-between mt-4'>
        <ColoredBtn onClick={handleRegister}>注册</ColoredBtn>
      </div>
    </div>
  );
};

const LoginNormal = () => {
  const [username] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const {setLogin, setLoginVisible} = useLoginState();
  const {setUser} = useRoleStore();
  const {setUserRole} = useRoleStore();
  const handleRegister = async () => {
    if (password.length <= 4) {
      alert('密码格式有误，必须大于4位');
      return;
    }
    const data = {
      username,
      phone,
      password,
    };
    try {
      const response = await axios.post(`http://${SeverLink}/api/login`, data);
      const responseData = response.data;
      console.log(responseData);
      if (response.data.status === 'error') {
        alert(response.data.message);
      } else {
        setLogin(true);
        setLoginVisible(false);
        let access_token = response.data.access_token;
        let unique_id = response.data.unique_id;
        SetCookieNSession(access_token, unique_id, response.data.name);
        setUser(response.data.name);
        if (response.data.role) {
          console.log('set to teacher')
          setUserRole('teacher');
          setRole2Teacher()
        }
        window.location.reload(); // 强制
      }
    } catch (error) {
      console.error(error);
      alert('登录失败，请重试');
    }
  };

  return (
    <div className='z-50 flex flex-col gap-4'>
      <InputField
        label='手机号'
        type='phone'
        placeholder='请输入注册的手机号'
        onChange={(e) => setPhone(e.target.value)}
      />
      <InputField
        label='密码'
        type='password'
        placeholder='请输入您的密码'
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className='flex items-center justify-between mt-4'>
        <ColoredBtn onClick={handleRegister}>登陆</ColoredBtn>
      </div>
    </div>
  );
};
