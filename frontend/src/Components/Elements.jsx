import React from 'react';
import {useState, useEffect, useRef} from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import {LuClipboard, LuClipboardCheck} from 'react-icons/lu';
// -------------------------Title-------------------------
export const Titles = ({text, stl}) => {
  return <h1 className={stl}>{text}</h1>;
};

export const TransparentTitle = ({text, size = 'lg'}) => {
  return (
    <h1
      className={`px-2 py-1 bg-transparent dark:text-neutral-300 text-neutral-700 prose prose-invert text-${size} font-semibold`}>
      {text}
    </h1>
  );
};

// --------------------------inputs-----------------------
export const InputField = ({label, type, placeholder, onChange}) => (
  <div>
    <label className='block mb-2 text-sm font-normal text-inherit' htmlFor={type}>
      {label}
    </label>
    <input
      className='w-full px-3 py-2 font-normal leading-tight border rounded appearance-none dark:bg-neutral-600 bg-neutral-200 dark:placeholder:text-neutral-400 placeholder:text-neutral-600 placeholder:text-sm dark:text-neutral-200 text-neutral-800 focus:outline-none focus:shadow-outline'
      id={label}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
    />
  </div>
);

export const TextEdit = ({
  text = '未命名',
  length = 10,
  setText,
  ph = '未命名',
  align = 'center',
  icon = true,
}) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(text);
  const inputRef = useRef();

  const Align = (align) => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };

  const onChange = (event) => {
    setInputValue(event.target.value);
  };

  const onFocus = () => {
    setEditing(true);
  };
  const onBlur = () => {
    setEditing(false);
    setText(inputValue);
    if (inputValue.trim() === '') {
      setInputValue(ph);
    }
  };

  useEffect(() => {
    setInputValue(text);
  }, [text]);

  return (
    <span className={`relative z-20 py-1 px-1 w-fit text-md ${Align(align)}`} key={text}>
      <input
        className={`dark:placeholder:text-neutral-500 placeholder:text-neutral-500 
        ${
          editing
            ? 'dark:text-neutral-400 text-neutral-600'
            : 'dark:text-neutral-500 text-neutral-500'
        } box-border appearance-none 
        ${Align(align)} block focus-visible:bg-transparent 
        focus-within:bg-transparent focus:bg-transparent 
        focus:border-0 outline-none focus:outline-none w-auto max-w-[200px]`}
        type='text'
        value={inputValue}
        spellCheck={false}
        maxLength={length}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        // autoFocus
        ref={inputRef}
        placeholder={ph}
      />
    </span>
  );
};

export const TextAreaEdit = ({text, length, setText, ph = '未命名字段'}) => {
  const [value, setValue] = useState(text || ph);
  const [editing, setEditing] = useState(false);
  const textAreaRef = useRef();

  const onChange = (event) => {
    setValue(event.target.value);
    setText(event.target.value);
  };

  const onClick = () => {
    setEditing(true);
  };

  const onBlur = () => {
    setEditing(false);
    if (value.trim() === '') {
      setValue(ph);
    }
  };

  return (
    <div
      className='z-20 text-xs p-1 w-full overflow-y-auto max-h-[10vh] h-fit rounded-md'
      onClick={onClick}>
      <TextareaAutosize
        ref={textAreaRef}
        className={` appearance-none bg-transparent w-full whitespace-nowrap resize-none ${
          editing
            ? 'dark:text-neutral-400 text-neutral-600'
            : 'dark:text-neutral-500 text-neutral-500'
        } `}
        value={value}
        spellCheck={false}
        maxLength={length}
        onChange={onChange}
        onBlur={onBlur}
        autoFocus
        placeholder={ph}
        minRows={1}
      />
    </div>
  );
};
// -------------------------paragraph-------------------------

export const Subtext = ({text, align = 'center', children}) => {
  const Align = (align) => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };
  return (
    <p className={`${Align(align)} text-xs dark:text-neutral-500 text-neutral-500`}>
      {text}
      {children}
    </p>
  );
};
// -------------------------tabs-------------------------
export const Tabs = ({children}) => {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  return (
    <div className='dark:text-neutral-400 text-neutral-600'>
      <ul className='flex justify-center gap-4 tab-list'>
        {children.map((child, index) => {
          const {label} = child.props;

          return (
            <li key={index} onClick={() => setActiveTab(label)}>
              <Tab label={label} activeTab={activeTab}>
                {label}
              </Tab>
            </li>
          );
        })}
      </ul>
      {children.map((child) => {
        if (child.props.label !== activeTab) return undefined;
        return child.props.children;
      })}
    </div>
  );
};

export const Tab = ({children, label, activeTab}) => {
  return (
    <div
      className={`tab-list-item px-4 py-2 prose prose-invert text-base font-semibold transition-all rounded-xl duration-300 ease-out ${
        activeTab === label
          ? 'dark:bg-neutral-700 bg-neutral-300 dark:text-neutral-300 text-neutral-700'
          : 'dark:bg-neutral-400/0 bg-neutral-600/0'
      }`}>
      {children}
    </div>
  );
};

// -------------------------Buttons-------------------------

const typo = 'prose-md dark:text-neutral-300 text-neutral-700 text-neutral-300';

export const ColoredBtn = ({onClick, children}) => (
  <button
    className='px-4 py-2 font-normal text-white rounded bg-amber-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline'
    type='button'
    onClick={onClick}>
    {children}
  </button>
);

export function ThemeToggleButton() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 在组件加载时立即设置深色模式
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <SwitchWithText
      checked={isDarkMode}
      onChange={toggleTheme}
      text={isDarkMode ? '深色模式' : '浅色模式'}
    />
  );
}

export const ActionBtn = ({icon, title, onClick}) => {
  return (
    <button
      className='relative z-20 flex items-center gap-2 p-3 pl-1 pr-3 dark:hover:bg-neutral-600 hover:bg-neutral-400 dark:text-neutral-100 text-neutral-900 w-fit grow-0'
      onClick={onClick}>
      {icon}
      <p className={typo}>{title}</p>
    </button>
  );
};

export const RingBtn = ({title, click}) => {
  return (
    <button
      className='
    transition-all w-fit  duration-200 ease-out 
    whitespace-nowrap border shadow-dr
    dark:border-neutral-600 border-neutral-400
    h-fit p-3 flex f;
    dark:hover:bg-neutral-700 hover:bg-neutral-300
    text-2xl font-semibold text-left 
    rounded-xl'
      onClick={click}>
      {title}

    </button>
  );
};

export const RingToggleBtn = ({btn, setbtn, title, sytle = 'px-4 py-2'}) => {
  const handleButtonClick = () => {
    setbtn(!btn);
  };
  return (
    <button
      className={`relative ${sytle}
    transition-all duration-100 ease-out active:border-neutral-500
    rounded-md w-fit dark:text-neutral-400 text-neutral-600
    dark:hover:bg-neutral-800 hover:bg-neutral-200
    border dark:border-neutral-700 border-neutral-300 whitespace-nowrap`}
      onClick={handleButtonClick}>
      {title}
    </button>
  );
};

export const SwitchButtonNormal = ({checked, onChange, disabled = false, className = ''}) => (
  <div className='relative flex items-center select-none w-fit grow-0'>
    <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
      <input
        type='checkbox'
        className='sr-only peer'
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div
        className="w-[40px] h-6 
    rounded-full ring-2 dark:ring-neutral-300 ring-neutral-700
    peer
    peer-checked:after:translate-x-full peer-checked:after:border-white 
    after:content-[''] after:absolute after:top-[4px] after:left-[4px] dark:after:bg-neutral-300 after:bg-neutral-700
    after:rounded-full 
    after:h-4 after:w-4 after:transition-all 
    dark:peer-checked:bg-neutral-300/30 peer-checked:bg-neutral-700/30"></div>
    </label>
  </div>
);

export const SwitchButton = ({checked, onClick, disabled = false, className = ''}) => (
  <div className='relative flex items-center select-none w-fit grow-0'>
    <label className={`relative inline-flex items-center cursor-pointer ${className}`}>
      <input
        type='checkbox'
        className='sr-only peer'
        checked={checked}
        onChange={() => {}}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
        disabled={disabled}
      />
      <div
        className="w-[40px] h-6 
    rounded-full ring-2 dark:ring-neutral-300 ring-neutral-700
    peer
    peer-checked:after:translate-x-full peer-checked:after:border-white 
    after:content-[''] after:absolute after:top-[4px] after:left-[4px] dark:after:bg-neutral-300 after:bg-neutral-700
    after:rounded-full 
    after:h-4 after:w-4 after:transition-all 
    dark:peer-checked:bg-neutral-300/30 peer-checked:bg-neutral-700/30"></div>
    </label>
  </div>
);

export const ActionIconButton = ({
  onClick, // 点击按钮时触发的函数
  isActioned, // 控制图标显示的状态变量
  isActionable = true, // 控制按钮是否可点击
  icon, // 用于显示的图标，可以是一个函数，一个React组件，或者一个包含两个React组件的数组
}) => {
  const [isDisabled, setIsDisabled] = useState(false); // 控制按钮是否禁用的状态变量
  const Btnstl = `p-1 flex items-center justify-center w-8 h-8 rounded-md ${
    isActionable
      ? 'dark:text-neutral-400 text-neutral-600 text-neutral-400 dark:hover:bg-neutral-700 hover:bg-neutral-300 hover:bg-neutral-700 dark:hover:ring-neutral-600 hover:ring-neutral-400 hover:ring-neutral-600 hover:ring-1'
      : 'dark:text-neutral-600 text-neutral-400 text-neutral-600'
  }`;
  // console.log(isActioned)
  // 处理按钮点击事件的函数，会阻止事件冒泡，然后禁用按钮，执行onClick函数，最后启用按钮
  const handleButtonClick = (event) => {
    event.stopPropagation();
    setIsDisabled(true);
    const result = onClick();
    if (result instanceof Promise) {
      result.finally(() => setIsDisabled(false));
    } else {
      setIsDisabled(false);
    }
  };

  // 根据icon的类型渲染图标的函数
  const renderIcon = () => {
    if (typeof icon === 'function') {
      return icon(isActioned);
    } else if (Array.isArray(icon)) {
      return isActioned ? icon[1] : icon[0];
    } else {
      return icon;
    }
  };

  return (
    <>
      <button className={Btnstl} onClick={handleButtonClick} disabled={isDisabled || !isActionable}>
        {renderIcon()}
      </button>
    </>
  );
};

export const SwitchWithText = ({checked, onChange, icon: Icon, text}) => (
  <div className='relative z-20 flex items-center gap-3 select-none w-fit grow-0'>
    <SwitchButtonNormal checked={checked} onChange={onChange} />
    <p className='prose prose-invert whitespace-nowrap'>{text}</p>
    {Icon && <Icon className='w-6 h-6 dark:text-neutral-300 text-neutral-700' />}
  </div>
);

export const CopyButton = ({data}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = async () => {
    console.log('on copy', data);
    await navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

  return (
    <div className='flex flex-row gap-2'>
      <button
        onClick={handleCopyClick}
        className='p-1 text-sm transition-all duration-75 ease-out rounded-full hover:bg-amber-600'>
        {copied ? <LuClipboardCheck className='w-5 h-5' /> : <LuClipboard className='w-5 h-5' />}
      </button>
    </div>
  );
};

export const DropdownMenu = ({
  list = ['item1', 'item2', 'item3'],
  actions = [() => {}, () => {}, () => {}],
  title = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='relative'>
      <RingToggleBtn btn={isOpen} setbtn={handleButtonClick} title={title} sytle='px-4 py-[6px]' />
      {isOpen && (
        <div className='absolute z-20 flex flex-col gap-2 p-2 border rounded-md bottom-12 w-fit h-fit bg-neutral-950/20 backdrop-blur-md dark:border-neutral-600 border-neutral-400'>
          {list.map((item, index) => (
            <div
              key={index}
              className='flex flex-row items-center gap-2 p-2 rounded-md dark:hover:bg-neutral-800/80 hover:bg-neutral-400/50'
              onClick={actions[index]}>
              <span className='leading-3 dark:text-neutral-300 text-neutral-700 whitespace-nowrap'>
                {item}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
