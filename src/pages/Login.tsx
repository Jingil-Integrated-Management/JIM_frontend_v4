import { useState } from 'react';

//axios
import { AxiosResponse } from 'axios';
import webClient from '../utils/Webclient';

//router
import { useHistory } from 'react-router-dom';

//types
import { TokenData } from '../types';

const Login = () => {
  return (
    <div className="flex w-full h-full justify-center items-center bg-gradient-to-br from-gradient-primary via-gradient-secondary to-gradient-end">
      <div className="login-content w-1200 h-800 flex flex-wrap justify-end content-center items-center mx-10">
        <LoginForm />
      </div>
    </div>
  );
};

const LoginForm = () => {
  const history = useHistory();
  const icon = require('../resources/icon.png').default;
  const [form, setForm] = useState({ username: '', password: '' });

  const signIn = async (user: { username: string; password: string }) => {
    try {
      const response: AxiosResponse = await webClient.post(
        'auth/signin/',
        user
      );
      const token = response.data as TokenData;

      localStorage.setItem('access', token.access);
      localStorage.setItem('refresh', token.refresh);
      localStorage.setItem('user', user.username);
      history.push('/');
    } catch (error) {
      alert('로그인 정보를 확인하세요.');
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.username === '') alert('아이디를 입력하세요.');
    else if (form.password === '') alert('비밀번호를 입력하세요.');
    else signIn({ username: form.username, password: form.password });

    setForm({
      username: '',
      password: '',
    });
  };

  return (
    <div className="login-form w-500 h-800 pt-80 px-50 pb-113 flex content-center items-center flex-col">
      <div className="w-94 mr-auto">
        <img src={icon} alt="icon" />
      </div>
      <div className="flex w-full flex-col mt-140 mb-196">
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="username"
            onChange={onChange}
            placeholder="아이디"
            className="login-input flex w-full h-54 pl-20 text-input font-medium"
          />
          <input
            type="password"
            name="password"
            onChange={onChange}
            placeholder="비밀번호"
            className="login-input flex w-full h-54 pl-20 text-input font-medium my-26"
          />
          <button
            type="submit"
            className="login-button h-54 gap-8 w-full flex flex-row justify-center items-center cursor-pointer text-font-accent bg-background-primary text-lg font-medium"
          >
            로그인
          </button>
        </form>
      </div>
      <div className="flex justify-between w-full">
        <div className="flex justify-center w-full">
          <div className="flex justify-center mr-24 text-palette-grey-menuicons font-medium text-msg">
            로그인에 문제가 있으신가요?
          </div>
          <div className="flex justify-center cursor-pointer text-font-accent font-medium text-msg">
            연락하기
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
