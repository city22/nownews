// 获取新闻容器
const newsContainer = document.getElementById('news-container');

// 初始加载显示
newsContainer.innerHTML = '<p>正在加载最新新闻...</p>';

// 获取新闻数据
async function fetchNews() {
  try {
    const response = await fetch('/api/news');
    if (!response.ok) throw new Error('获取新闻失败');
    return await response.json();
  } catch (error) {
    console.error('获取新闻错误:', error);
    newsContainer.innerHTML = '<p class="error">无法获取新闻数据，请稍后重试</p>';
    return [];
  }
}

// 渲染新闻到页面
function renderNews(news) {
  newsContainer.innerHTML = news.map(item => `
    <div class="news-item">
      <h2>${item.title || '无标题'}</h2>
      <p>${item.description || '无描述内容'}</p>
      <p><small>${new Date(item.pubDate).toLocaleString()} - ${item.source || '未知来源'}</small></p>
      <a href="${item.link}" target="_blank">阅读全文</a>
    </div>
  `).join('');
}

// 初始加载并设置定时刷新
async function loadAndRefreshNews() {
  const news = await fetchNews();
  if (news.length > 0) {
    renderNews(news);
  }
  
  // 每30秒刷新一次
  setTimeout(loadAndRefreshNews, 30000);
}

// 启动应用
loadAndRefreshNews();