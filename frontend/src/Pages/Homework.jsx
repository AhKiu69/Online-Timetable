import AllWorks from '../Components/HomeWork/AllWorks';
import {useWorkStore} from '../Components/HomeWork/AllWorks';
import {SeverLink} from '../Link';
import {useRoleStore} from './signinpanel';

export default function Homework() {
  const {userRole} = useRoleStore();
  return (
    <div className='flex flex-col w-full h-[100vh] gap-4 overflow-hidden '>
      {userRole === 'teacher' && <SubmitBtn />}
      <AllWorks />
    </div>
  );
}

const SubmitBtn = () => {
  const {allworks} = useWorkStore();

  const sendWork = () => {
    fetch(`http://${SeverLink}/api/newWork`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(allworks),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        alert('保存成功');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <button
      onClick={sendWork}
      className='w-full p-2 bg-white border rounded-lg shadow-md sm:w-fit border-neutral-400 hover:bg-amber-300'>
      提交布置
    </button>
  );
};
