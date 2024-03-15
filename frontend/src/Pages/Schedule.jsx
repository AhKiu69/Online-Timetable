import MyCalendar from '../Components/Schedule/calendar';
import React, {useEffect} from 'react';
import create from 'zustand';
import {useCalStore} from '../Components/Schedule/calendar';
import moment from 'moment';
import {SeverLink} from '../Link';
import {useRoleStore} from './signinpanel';

export default function Schedule() {
  return (
    <div className='flex flex-col gap-3'>
      <SubmitBtn />
      <div className='w-full overflow-x-auto overflow-y-hidden '>
        <MyCalendar />
      </div>
    </div>
  );
}

const SubmitBtn = () => {
  const {userRole, setUserRole} = useRoleStore();
  const {events} = useCalStore();
  const {user} = useRoleStore();

  useEffect(() => {
    console.log(events);
  }, [events]);

  const Submit = () => {
    events.forEach((event) => {
      const data = {
        start: moment(event.start).format('YYYY-MM-DDTHH:mm:ss'),
        end: moment(event.end).format('YYYY-MM-DDTHH:mm:ss'),
        title: event.title,
        public: true,
        name: user,
        id:'1'
      };

      fetch(`http://${SeverLink}/updateslots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            console.log('提交成功');
            alert('提交成功');
          } else {
            console.log('提交失败');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  };

  return (
    <button
      className='p-2 border rounded-lg shadow-md border-neutral-400 hover:bg-amber-300 bg-neutral-50'
      onClick={Submit}>
      保存并提交
    </button>
  );
};
