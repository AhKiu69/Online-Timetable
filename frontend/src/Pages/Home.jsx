import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const t = `
# Hey there, I'm Shelva! 
## 嗨，我是Shelva！ 

I have a lot of experience working in language training institutions and international schools in Shanghai. My specialty is helping people prepare for the IELTS and TOEFL exams. I focus on improving listening, speaking, and overall English skills. I've been tutoring for over a decade and have helped so many students improve their scores.

> 有着上海知名语培机构和国际学校工作经验，擅长雅思和托福，致力于提升学生英语基础。超过万小时的辅导经验，数千学生的提分证明。

Learning English with me is actually enjoyable, not just a difficult task. I have a teaching style that combines professionalism and humor, so students not only do well on exams but also have a great time learning.

> 我注重专业和趣味并重，让学生轻松爱上英语。

I have a vibrant and approachable personality, which helps me create a positive and engaging learning environment. Hey there! Students call me "Sister Shelva" because I have a knack for building strong connections and making language learning a fun and effective experience. If you're looking for an inspiring and enjoyable English learning journey, then Shelva is the perfect choice! With Shelva, you'll get a combination of expertise and enthusiasm that will make success in learning English inevitable.

> 性格开朗，是学生心目中无比亲近的“董姐姐”。选择我，让英语学习变得轻松、有趣，一起迎接成功！


`;
const Home = () => {
  return (
    <div className='flex flex-col gap-4 p-5 sm:flex-row'>
      <img
        className='w-full h-full max-w-sm aspect-auto shrink-0'
        src='h'
        alt='shelva'
      />
      <div className='flex flex-col'>
        <ReactMarkdown className='prose-sm prose' children={t} remarkPlugins={[remarkGfm]} />
        <p></p>
      </div>
    </div>
  );
};

export default Home;
//
