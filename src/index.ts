import express from 'express';
import moment from 'moment-timezone';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/months', (req, res) => {
  const { lon, lat, from, to } = req.query;

  if (!lon || !lat || !from || !to) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // 验证日期格式
    const fromDate = moment(from as string, 'YYYY-MM');
    const toDate = moment(to as string, 'YYYY-MM');

    if (!fromDate.isValid() || !toDate.isValid()) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // 根据经纬度获取时区
    const timezone = moment.tz.zone(moment.tz.guess());
    if (!timezone) {
      return res.status(500).json({ error: 'Unable to determine timezone' });
    }

    // 生成月份起始时间数组
    const monthStarts: string[] = [];
    let currentDate = fromDate.clone();

    while (currentDate.isSameOrBefore(toDate, 'month')) {
      monthStarts.push(currentDate.clone().endOf('month').format('YYYY-MM-DDT16:00:00.000Z'));
      currentDate.add(1, 'month');
    }

    return res.json({ monthStarts });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 