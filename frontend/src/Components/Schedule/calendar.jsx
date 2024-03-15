import React, {useEffect} from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import {create} from 'zustand';
import './calendar.css';
import EventEditor from './EventEditor';
import {isMobile} from 'react-device-detect';
import {useLoginState} from '../../Pages/signinpanel';
import {SeverLink} from '../../Link';
import {useRoleStore} from '../../Pages/signinpanel';

moment.locale('zh-cn');
const localizer = momentLocalizer(moment);

const useCalStore = create((set) => ({
  publicEvents: [],
  events: [],
  setEvents: (events) => {
    console.log(events);
    set({events});
  },
  showEditor: false,
  setShowEditor: (showEditor) => set({showEditor}),
  EventNow: null,
  setEventNow: (EventNow) => set({EventNow}),
  setPublicEvents: (publicEvents) => set({publicEvents}),
}));
export {useCalStore};

const DnDCalendar = withDragAndDrop(Calendar);

const isOverlapping = (newEvent, allEvents) => {
  return allEvents.some((event) => newEvent.start < event.end && newEvent.end > event.start);
};

const MyCalendar = () => {
  const {userRole} = useRoleStore();
  const {publicEvents, events, setEvents, showEditor, setShowEditor} = useCalStore();
  const {isLogin} = useLoginState();
  useEffect(() => {
    if (isLogin == false) {
      console.log('no log retrurn');
      return;
    }
    console.log('request server');
    fetch(`http://${SeverLink}/timeslots`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)

        const eventsWithDates = data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        console.log('get time slot');
        useCalStore.setState({publicEvents: eventsWithDates});
      });
  }, [isLogin]);

  const updateEvent = ({event, start, end}) => {
    console.log('update event');
    const updatedEvent = {...event, start, end};
    const otherEvents = [...publicEvents, ...events].filter((e) => e !== event);
    if (!isOverlapping(updatedEvent, otherEvents)) {
      console.log('not isoverlapping');
      const updatedEvents = events.map((e) => (e === event ? updatedEvent : e));
      setEvents(updatedEvents);
    }
  };

  const EditorConfirm = ({endTime}) => {
    console.log('on editorConfirm');
    const adjustedEnd = endTime
      ? moment(endTime, 'HH:mm').toDate()
      : moment(start).add(1, 'hour').toDate();
    const newEvent = {
      start,
      end: adjustedEnd,
      title: userRole,
      subscribed: false,
    };
    if (!isOverlapping(newEvent, [...publicEvents, ...events])) {
      setEvents([...events, newEvent]);
    }
    setShowEditor(false);
  };

  const createEvent = ({start, end}) => {
    console.log('create event');
    const adjustedEnd = moment(end).subtract(1, 'minutes').toDate();
    const newEvent = {
      start,
      end: adjustedEnd,
      title: userRole,
      subscribed: false,
    };
    if (!isOverlapping(newEvent, [...publicEvents, ...events])) {
      console.log('not isoverlapping');
      setEvents([...events, newEvent]);
    }
  };

  const deleteEvent = (event) => {
    console.log('delete event');
    // 只删除events中的事件，不删除publicEvents中的事件
    if (userRole === 'teacher' || !publicEvents.includes(event)) {
      const updatedEvents = events.filter((e) => e !== event);
      setEvents(updatedEvents);
      console.log(event)
      fetch(`http://${SeverLink}/api/deleteslot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...event,
        _id: event._id,  // 添加这一行
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if (data.status === 'success') {
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    }
    
  };

  return (
    <div>
      {isMobile && (
        <EventEditor
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onConfirm={EditorConfirm}
        />
      )}
      <DnDCalendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView='week'
        events={[...publicEvents, ...events]}
        style={{height: '75vh', width: isMobile ? '800px' : '100%', backgroundColor: 'white'}}
        views={['week', 'day']}
        min={new Date(2023, 1, 1, 9, 0)}
        max={new Date(2023, 1, 1, 18, 0)}
        draggableAccessor={isMobile ? (event) => !publicEvents.includes(event) : false}
        resizableAccessor={isMobile ? (event) => !publicEvents.includes(event) : false}
        onSelectSlot={createEvent}
        selectable={true}
        onEventDrop={updateEvent}
        onEventResize={updateEvent}
        onDoubleClickEvent={deleteEvent}
        components={{
          event: MyEvent,
        }}
        eventPropGetter={eventStyleGetter}
        messages={messages}
      />
    </div>
  );
};

export default MyCalendar;

const MyEvent = ({event}) => {
  const {userRole} = useRoleStore();
  const {user} = useRoleStore();

  return (
    <>
      {userRole === 'teacher' ? (
        <span>{event.name}</span>
      ) : (
        event.name === user && <span>{event.name}</span>
      )}
    </>
  );
};

const eventStyleGetter = (event) => {
  const {user} = useRoleStore();
  let backgroundColor = event.public ? '#6b7280' : '#d97706';
  const color = event.public ? '#d4d4d4' : '#fafafa';
  const border = event.public ? '2px solid #404040' : '2px solid #92400e';
  const opacity = event.public ? 0.8 : 1;
  if (event.name === user) {
    backgroundColor = '#1faa62';
  }
  return {
    style: {
      opacity,
      color,
      backgroundColor,
      border,
      // boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
      borderRadius: '10px',
      padding: '10px',
    },
  };
};

const messages = {
  allDay: '全天',
  previous: '往前',
  next: '往后',
  today: '今日',
  month: '月',
  week: '周',
  day: '日',
  agenda: '议程',
  date: '日期',
  time: '时间',
  event: '事件',
  showMore: (total) => `+显示更多 (${total})`,
  monthNames: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
};
