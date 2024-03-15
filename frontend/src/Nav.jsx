import React from 'react';
import {isMobile} from 'react-device-detect';
import {Link} from 'react-router-dom';
import {ani100} from './CommonStyle';
const Nav = ({pages}) => {
  return (
    <nav
      className={`text-neutral-800 font-bold bg-neutal-300 border border-b border-neutral-400 p-3 
    relative top-0 w-full flex justify-between items-center shadow-md ${ani100}`}>
      <ul className='flex space-x-4'>
        {pages.map((page, index) => (
          <li key={index} className={`rounded px-2 py-1 hover:bg-green-300 ${ani100}`}>
            <Link to={page.path}>{isMobile ? page.icon : page.name}</Link>
          </li>
        ))}
      </ul>
      <p className='prose text-right sm:prose-sm xl:prose-xl'>Shelva Academy</p>
      {/* <span className='w-[10px] h-full bg-cyan-600'></span> */}
    </nav>
  );
};

export default Nav;
