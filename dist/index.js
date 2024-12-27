"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.get('/months', (req, res) => {
    const { lon, lat, from, to } = req.query;
    if (!lon || !lat || !from || !to) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }
    try {
        // 验证日期格式
        const fromDate = moment_timezone_1.default.utc(from, 'YYYY-MM').subtract(1, 'month');
        const toDate = moment_timezone_1.default.utc(to, 'YYYY-MM').subtract(1, 'month');
        if (!fromDate.isValid() || !toDate.isValid()) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        // 生成月份起始时间数组
        const monthStarts = [];
        let currentDate = fromDate.clone();
        while (currentDate.isSameOrBefore(toDate, 'month')) {
            const date = currentDate.clone().endOf('month');
            date.hours(16).minutes(0).seconds(0).milliseconds(0);
            monthStarts.push(date.format('YYYY-MM-DDT16:00:00.000[Z]'));
            currentDate.add(1, 'month');
        }
        return res.json({ monthStarts });
    }
    catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
