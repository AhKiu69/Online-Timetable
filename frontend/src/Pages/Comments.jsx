import React, {useState, useEffect} from 'react';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import {useLoginState} from './signinpanel';
import {useRoleStore} from './signinpanel';
import {SeverLink} from '../Link';
import 'react-quill/dist/quill.snow.css'; // 导入样式


export default function Comments() {
  const [comments, setComments] = useState([]);
  // const [comments, setComments] = useState(fakeComments);

  const {isLogin} = useLoginState();
  useEffect(() => {
    if (isLogin == false) {
      console.log('no log retrurn');
      return;
    }
    console.log('request server');
    fetch(`http://${SeverLink}/api/comments`)
      .then((response) => response.json())
      .then((data) => {
        console.log('get comments');
        console.log(data);
        if (data) {
          setComments(data);
        }
      });
  }, [isLogin]);

  const addComment = (comment) => {
    setComments([...comments, comment]);
  };

  return (
    <div>
      <CommentList comments={comments} />
      <CommentForm addComment={addComment} />
    </div>
  );
}

function CommentList({comments}) {
  return (
    <div className='flex flex-col divide-y divide-neutral-400'>
      {comments.map((comment, index) => (
        <div className='flex flex-col gap-3 p-3' key={index}>
          <div className='flex flex-row items-center gap-3 w-fit h-fit'>
            <p className='text-xl font-medium text-neutral-800'>{comment.user}</p>
            <p className='text-neutral-500'>{comment.date}</p>
          </div>
          <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(comment.text)}} />
        </div>
      ))}
    </div>
  );
}

function send2server(msg) {
  fetch(`http://${SeverLink}/api/addcomment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
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
// 评论输入组件
function CommentForm({addComment}) {
  const [value, setValue] = useState('');
  // const [username] = useState('匿名用户'); // 假设这是一个固定的用户名
  const {user} = useRoleStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);

    let data = {user, text: value, date: new Date().toLocaleString()};
    addComment(data);
    setValue('');
    console.log(data);
    send2server(data);
  };

  return (
    <form className='flex flex-col gap-3' onSubmit={handleSubmit}>
      <ReactQuill value={value} onChange={setValue} modules={modules} />
      <button
        className='w-full p-2 px-4 bg-white border rounded-lg shadow-md sm:w-fit border-neutral-400 hover:bg-amber-300'
        type='submit'>
        提交
      </button>
    </form>
  );
}

const modules = {
  toolbar: [
    [{list: 'ordered'}, {list: 'bullet'}],
    ['bold', 'italic', 'underline'], // toggled buttons
    [{color: []}, {background: []}], // dropdown with defaults from theme
    [{header: 1}, {header: 2}], // custom button values
    [{size: ['small', false, 'large', 'huge']}], // custom dropdown
    [{align: []}],
    // ['blockquote'],
    // ['image', 'video'], // link and image, video
  ],
};
