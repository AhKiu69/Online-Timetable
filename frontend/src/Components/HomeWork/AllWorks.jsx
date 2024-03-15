import React, {useEffect, useState, useCallback} from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import DatePicker from 'react-datepicker';
import addYears from 'date-fns/addYears';
import 'react-datepicker/dist/react-datepicker.css';
import {SeverLink} from '../../Link';
// import {generateData} from './DataGen';
import {create} from 'zustand';
import Cookies from 'js-cookie';
import {useRoleStore} from '../../Pages/signinpanel';

export const useWorkStore = create((set) => ({
  allworks: [],
  setAllWorks: (allworksData) => set({allworks: allworksData}),
  handleAddWork: (personId, newWork) =>
    set((state) => ({
      allworks: state.allworks.map((person) => {
        if (person.uid === personId) {
          return {...person, works: [...person.works, newWork]};
        } else {
          return person;
        }
      }),
    })),
  handleCompleteWork: (personId, workId) =>
    set((state) => ({
      allworks: state.allworks.map((person) => {
        if (person.uid === personId) {
          return {
            ...person,
            works: person.works.map((work) => {
              if (work.id === workId) {
                return {...work, archive: !work.archive}; // 切换 archive 的状态
              } else {
                return work;
              }
            }),
          };
        } else {
          return person;
        }
      }),
    })),
}));

const AllWorks = () => {
  const {allworks, setAllWorks} = useWorkStore();
  const {userRole} = useRoleStore();
  const id = Cookies.get('unique_id');
  useEffect(() => {
    fetch(`http://${SeverLink}/api/getWorks?unique_id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let allworksData = data;
        console.log(allworksData);
        allworksData.forEach((person) => {
          person.works.sort((a, b) => new Date(a.ddl_date) - new Date(b.ddl_date));
        });
        setAllWorks(allworksData);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [setAllWorks]);

  return userRole === 'teacher' ? (
    <div
      className='relative grid gap-5 overflow-y-auto 
    sm:grid-cols-1 
    md:grid-cols-2 
    lg:grid-cols-3 
    xl:grid-cols-3 
    2xl:grid-cols-4 
    h-[90vh]'>
      {allworks.map((person) => (
        <PersonCard person={person} key={person.uid} />
      ))}
    </div>
  ) : (
    <>
      {allworks.map((person) => (
        <PersonCard person={person} key={person.uid} />
      ))}
    </>
  );
};

export default AllWorks;

const useNewWorkState = () => {
  const [newWork, setNewWork] = useState({
    id: '',
    content: '',
    crt_date: new Date(),
    ddl_date: new Date(),
  });
  const resetNewWork = useCallback(() => {
    setNewWork({
      id: '',
      content: '',
      crt_date: new Date(),
      ddl_date: new Date(),
    });
  }, []);
  return {newWork, setNewWork, resetNewWork};
};

const AddWorkButton = ({onAdd}) => {
  const [isAdding, setIsAdding] = useState(false);
  const {newWork, setNewWork, resetNewWork} = useNewWorkState();
  const handleToggle = useCallback(() => {
    setIsAdding(!isAdding);
  }, [isAdding]);

  const handleAdd = useCallback(() => {
    if (newWork.content) {
      const uniqueId = `${Date.now()}`; // 创建唯一的 ID
      onAdd({...newWork, id: uniqueId}); // 将唯一的 ID 添加到新的工作项中
      resetNewWork();
      setIsAdding(false);
    }
  }, [newWork, onAdd, resetNewWork]);

  return (
    <div className='flex items-center justify-center p-2 text-2xl font-thin border shadow-sm select-none rounded-xl border-neutral-400'>
      {isAdding ? (
        <WorkInput work={newWork} setWork={setNewWork} onAdd={handleAdd} />
      ) : (
        <div className='w-full text-center h-fit' onClick={handleToggle}>
          +
        </div>
      )}
    </div>
  );
};

const WorkInput = ({work, setWork, onAdd}) => {
  const handleDateChange = (date) => {
    setWork({...work, ddl_date: date.toISOString()});
  };

  return (
    <div className='flex flex-col w-full gap-2 text-base font-normal'>
      <div className='flex flex-row justify-between'>
        <DatePicker
          className='px-2 py-1 w-fit'
          selected={new Date(work.ddl_date)}
          onChange={handleDateChange}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={30}
          timeCaption='time'
          dateFormat='MM月d日 HH:mm'
          customTimeInput={<CustomTimeInput />}
          maxDate={addYears(new Date(), 1)}
        />
        <button className='px-2 py-1 rounded-md bg-lime-300' onClick={onAdd}>
          保存修改
        </button>
      </div>
      <TextareaAutosize
        className='w-full p-2 border rounded-md appearance-none resize-none border-neutral-400 '
        value={work.content}
        onChange={(e) => setWork({...work, content: e.target.value})}
      />
    </div>
  );
};

const PersonCard = ({person}) => {
  const {handleAddWork} = useWorkStore();
  const {userRole} = useRoleStore();
  return (
    <div className='flex flex-col gap-3 p-5 pt-2 bg-white border shadow-md rounded-xl border-neutral-300'>
      <h2 className='prose prose-2xl'>{userRole === 'student' ? '我的作业' : person.name}</h2>
      <div className='flex flex-col gap-3'>
        {person.works.length > 0 ? (
          person.works.map((work, index) => (
            <WorkItem work={work} key={index} personId={person.uid} />
          ))
        ) : (
          <p className='w-full text-center'>没有作业</p>
        )}
        {userRole === 'teacher' && (
          <AddWorkButton onAdd={(newWork) => handleAddWork(person.uid, newWork)} />
        )}
      </div>
    </div>
  );
};

const WorkItem = ({work, personId}) => {
  const {handleCompleteWork} = useWorkStore();
  const {userRole} = useRoleStore();


  const ddlDate = new Date(work.ddl_date);
  const currentDate = new Date();
  const diffDays = Math.ceil((ddlDate - currentDate) / (1000 * 60 * 60 * 24));
  const isExpired = diffDays < 0;
  const bgColor = isExpired ? '#FFCECE' : '#D2FFCE';
  const text =
    diffDays === 0 ? '今天到期' : isExpired ? `过期${Math.abs(diffDays)}天` : `${diffDays}天到期`;
  const handleComplete = () => {
    handleCompleteWork(personId, work.id);
  };
  const opacity = work.archive ? 0.2 : 1;
  return (
    <div
      className='flex flex-col gap-2 pl-2 border-l-4 select-none border-neutral-400'
      style={{opacity}}
      onClick={() => userRole !== 'student' && handleComplete()}>
      <div className='w-fit h-fit whitespace-nowrap'>
        <div className='flex flex-row items-center gap-2'>
          <p
            className='px-2 font-medium rounded-md text-neutral-700'
            style={{backgroundColor: bgColor}}>
            {formatDate(ddlDate)}{' '}
          </p>
          <p className='text-sm'>{text}</p>
        </div>
      </div>
      <p className='font-normal text-neutral-600'>{work.content}</p>
    </div>
  );
};

function formatDate(date) {
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${
    date.getMinutes() < 10 ? '0' : ''
  }${date.getMinutes()}`;
}

const CustomTimeInput = ({value, onChange}) => {
  const hours = Array.from({length: 13}, (_, i) => i + 8); // 从8点到20点
  const minutes = ['00', '30'];

  const handleChange = (type, val) => {
    const [hour, minute] = value.split(':');
    if (type === 'hour') {
      onChange(`${val}:${minute}`);
    } else {
      onChange(`${hour}:${val}`);
    }
  };

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <select value={value.split(':')[0]} onChange={(e) => handleChange('hour', e.target.value)}>
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      :
      <select value={value.split(':')[1]} onChange={(e) => handleChange('minute', e.target.value)}>
        {minutes.map((minute) => (
          <option key={minute} value={minute}>
            {minute}
          </option>
        ))}
      </select>
    </div>
  );
};
