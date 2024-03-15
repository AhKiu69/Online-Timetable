import * as qiniu from 'qiniu-js';
import React, {useEffect, useCallback, useState, useRef} from 'react';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import {useLoginState} from './signinpanel';
import {SeverLink} from '../Link';
import 'react-quill/dist/quill.snow.css'; // 导入样式
import {useRoleStore} from './signinpanel';

export function useUploadToQiniu() {
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadToQiniu = useCallback((file) => {
    return new Promise((resolve, reject) => {
      // 直接在这里获取上传令牌
      fetch(`http://${SeverLink}/upload_token`)
        .then((response) => response.json())
        .then((data) => {
          console.log('get token:', data.token);
          const uploadToken = data.token;
          const putExtra = {
            fname: '',
            params: {},
            mimeType: ['image/png', 'image/jpeg', 'image/gif'],
          };

          const config = {
            useCdnDomain: true,
          };

          const observable = qiniu.upload(file, `shelva/${file.name}`, uploadToken, putExtra, config);

          observable.subscribe({
            next(res) {
              console.log('upload progress: ', res.total.percent);
              setUploadProgress(res.total.percent);
            },
            error(err) {
              console.log('upload error: ', err);
              reject(err);
            },
            complete(res) {
              console.log('upload complete: ', res);
              let site = 'htn/' + res.key;
              console.log(site);
              setImageUrl(site);
              resolve(site);
            },
          });
        });
    });
  }, []);

  return {uploadToQiniu, imageUrl, uploadProgress};
}

export default function Display() {
  const {userRole} = useRoleStore();
  const [messages, setMessage] = useState([]);
  const {isLogin} = useLoginState();
  console.log(userRole)
  const addMessage = (message) => {
    setMessage([...messages, message]);
  };

  useEffect(() => {
    if (isLogin == false) {
      console.log('no log retrurn');
      return;
    }
    console.log('request server');
    fetch(`http://${SeverLink}/messages`)
      .then((response) => response.json())
      .then((data) => {
        console.log('get messages');
        console.log(data);
        if (data) {
          setMessage(data);
        }
      });
  }, [isLogin, setMessage]);

  return (
    <div>
      <MessageList messages={messages} />
      {userRole === 'teacher' && <MessageForm addMessage={addMessage} />}
    </div>
  );
}

// 评论输入组件
function MessageForm({addMessage}) {
  const [value, setValue] = useState('');
  const {uploadToQiniu} = useUploadToQiniu(); // 引入 useUploadToQiniu hook
  const {user} = useRoleStore();

  const quillRef = useRef(); // 创建一个引用
  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const imageUrl = await uploadToQiniu(file);
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.deleteText(range.index, range.length);
      quill.clipboard.dangerouslyPasteHTML(range.index, `<img src="${imageUrl}" />`);
    };
  };

  useEffect(() => {
    const quill = quillRef.current.getEditor();
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', imageHandler);
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{list: 'ordered'}, {list: 'bullet'}],
        ['bold', 'italic', 'underline'], // toggled buttons
        [{color: []}, {background: []}], // dropdown with defaults from theme
        [{header: 1}, {header: 2}], // custom button values
        [{size: ['small', false, 'large', 'huge']}], // custom dropdown
        [{align: []}],
        ['image'],
      ],
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
    let data = {user, text: value, date: new Date().toLocaleString()};
    addMessage(data);
    setValue('');
    console.log(data);
    send2server(data);
  };

  return (
    <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
      <ReactQuill ref={quillRef} value={value} onChange={setValue} modules={modules} />
      <button
        className='w-full p-2 px-4 bg-white border rounded-lg shadow-md sm:w-fit border-neutral-400 hover:bg-amber-300'
        type='submit'>
        提交
      </button>
    </form>
  );
}

function send2server(msg) {
  fetch(`http://${SeverLink}/api/addmessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'include',
    body: JSON.stringify(msg),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function MessageList({messages}) {
  return (
    <div className='flex flex-col divide-y divide-neutral-400'>
      <h1>作品展览</h1>
      {messages.map((message, index) => (
        <div className='flex flex-col gap-3 p-3' key={index}>
          <div className='flex flex-row items-center gap-3 w-fit h-fit'>
            <p className='text-xl font-medium text-neutral-800'>{message.user}</p>
            <p className='text-neutral-500'>{message.date}</p>
          </div>
          <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(message.text)}} />
        </div>
      ))}
    </div>
  );
}
