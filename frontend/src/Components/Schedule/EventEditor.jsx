import React, {useState} from 'react';
import TimePicker from 'react-time-picker';

const EventEditor = ({isOpen, onClose, onConfirm}) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const handleConfirm = () => {
    onConfirm({startTime, endTime});
    onClose();
  };
  if (!isOpen) {
    console.log("EventEditor is not open"); // 打印EventEditor的状态
    return null;
  }
  console.log("EventEditor is open"); // 打印EventEditor的状态
  return (
    <div className='absolute w-full h-full'>
      <div className='w-32 h-32 bg-neutral-600'>
        <TimePicker onChange={setStartTime} value={startTime} />
        <TimePicker onChange={setEndTime} value={endTime} />
      </div>
      <button onClick={handleConfirm}>确认</button>
      <button onClick={onClose}>取消</button>
    </div>
  );
};

export default EventEditor;
