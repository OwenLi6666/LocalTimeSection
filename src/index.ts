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
    const fromDate = moment.utc(from as string, 'YYYY-MM').subtract(1, 'month');
    const toDate = moment.utc(to as string, 'YYYY-MM').subtract(1, 'month');

    if (!fromDate.isValid() || !toDate.isValid()) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // 生成月份起始时间数组
    const monthStarts: string[] = [];
    let currentDate = fromDate.clone();

    while (currentDate.isSameOrBefore(toDate, 'month')) {
      const date = currentDate.clone().endOf('month');
      date.hours(16).minutes(0).seconds(0).milliseconds(0);
      monthStarts.push(date.format('YYYY-MM-DDT16:00:00.000[Z]'));
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