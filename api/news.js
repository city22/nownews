import axios from 'axios';
import { parseString } from 'xml2js';

export default async (req, res) => {
  try {
    // 使用BBC新闻RSS作为示例
    const rssUrl = 'http://feeds.bbci.co.uk/news/rss.xml';
    const response = await axios.get(rssUrl);
    
    parseString(response.data, (err, result) => {
      if (err) {
        console.error('解析RSS错误:', err);
        return res.status(500).json({ error: '解析新闻失败' });
      }

      const items = result.rss.channel[0].item.map(item => ({
        title: item.title[0],
        description: item.description[0],
        link: item.link[0],
        pubDate: item.pubDate[0],
        source: 'BBC News'
      }));

      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
      res.status(200).json(items);
    });
  } catch (error) {
    console.error('获取新闻错误:', error);
    res.status(500).json({ error: '获取新闻失败' });
  }
};