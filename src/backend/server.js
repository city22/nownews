const express = require('express');
const axios = require('axios');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

// 创建WebSocket服务器
const wss = new WebSocket.Server({ port: 8080 });

// 存储新闻数据
let newsData = [];

// 模拟新闻数据
const mockNews = [
  {
    title: "示例新闻1",
    description: "这是第一条示例新闻内容",
    url: "https://example.com/news1",
    publishedAt: new Date().toISOString(),
    source: { name: "示例新闻源" }
  },
  {
    title: "示例新闻2",
    description: "这是第二条示例新闻内容",
    url: "https://example.com/news2",
    publishedAt: new Date().toISOString(),
    source: { name: "示例新闻源" }
  }
];

// 定时从新闻源获取数据
async function fetchNews() {
  try {
    // 使用环境变量中的API Key
    const apiKey = process.env.NEWS_API_KEY || 'YOUR_API_KEY';
    if (apiKey === 'YOUR_API_KEY') {
      console.log('使用模拟新闻数据');
      newsData = mockNews;
    } else {
      const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
      newsData = response.data.articles;
    }
    
    // 广播新数据给所有连接的客户端
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(newsData));
      }
    });
  } catch (error) {
    console.error('获取新闻失败，使用模拟数据:', error.message);
    newsData = mockNews;
  }
}

// 每30秒获取一次新闻
setInterval(fetchNews, 30000);
fetchNews(); // 初始获取

// 提供静态文件
app.use(express.static(path.join(__dirname, '../../frontend')));

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('要使用真实新闻数据，请设置NEWS_API_KEY环境变量');
});