export function generateData(num) {
  const firstNames = [
    '王',
    '李',
    '张',
    '刘',
    '陈',
    '杨',
    '黄',
    '周',
    '吴',
    '徐',
    '孙',
    '胡',
    '朱',
    '高',
    '林',
  ];
  const secondNames = [
    '小',
    '丰田',
    'lee',
    '空雨',
    '则立',
    '明浩',
    '天',
    '非',
    '余翔',
    'Noah',
    'James',
    'Alice',
    'John',
    'Emma',
    'May',
    'Rose',
    'Lulu',
    'Ling',
  ];
  const contents = [
    '写一篇关于你的Favorite Book的英文书评',
    '写一篇关于你的Weekend Plan的英文日记',
    '听一段TED Talk，然后进行口头报告',
    '写一篇关于我的假期生活的英语作业，描述我假期的见闻和感受，包括所见所闻和所思所感。',
    '阅读并总结《哈姆雷特》的主要情节',
    '写一篇关于环保的议论文',
    '准备并进行一次关于Global Warming的英文演讲',
    '研究并介绍英国的饮食文化',
    '阅读《The Great Gatsby》并进行Book Club讨论',
    '阅读《Pride and Prejudice》并写一篇读后感',
    '写一篇关于你的Dream School的英文短文',
    '听BBC新闻,总结并分享你的观点',
  ];

  const data = Array.from({length: num}, (_, index) => {
    const firstNameIndex = Math.floor(Math.random() * firstNames.length);
    const firstName = firstNames[firstNameIndex];
    firstNames.splice(firstNameIndex, 1); // 移除已经使用的名字

    const secondNameIndex = Math.floor(Math.random() * secondNames.length);
    const secondName = secondNames[secondNameIndex];
    secondNames.splice(secondNameIndex, 1); // 移除已经使用的名字

    const name = `${secondName}${firstName}`;

    const works = Array.from({length: Math.floor(Math.random() * 3) + 2}, (_, i) => {
      const content = contents[Math.floor(Math.random() * contents.length)];
      const dateOffset = Math.floor(Math.random() * 10) - 5; // Generate a random number between -5 and 5
      const crt_date = new Date();
      crt_date.setDate(crt_date.getDate() + dateOffset);
      const ddl_date = new Date(crt_date);
      ddl_date.setDate(ddl_date.getDate() + 1);
      return {
        id: `${index + 1}-${i + 1}`,
        content,
        crt_date: crt_date.toISOString(),
        ddl_date: ddl_date.toISOString(),
      };
    });
    return {
      uid: `${index + 1}`,
      name,
      works,
    };
  });

  return data;
}

