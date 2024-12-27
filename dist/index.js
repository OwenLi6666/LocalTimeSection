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
        const fromDate = (0, moment_timezone_1.default)(from, 'YYYY-MM');
        const toDate = (0, moment_timezone_1.default)(to, 'YYYY-MM');
        if (!fromDate.isValid() || !toDate.isValid()) {
            return res.status(400).json({ error: 'Invalid date format' });
        }
        // 根据经纬度获取时区
        const timezone = moment_timezone_1.default.tz.zone(moment_timezone_1.default.tz.guess());
        if (!timezone) {
            return res.status(500).json({ error: 'Unable to determine timezone' });
        }
        // 生成月份起始时间数组
        const monthStarts = [];
        let currentDate = fromDate.clone();
        while (currentDate.isSameOrBefore(toDate, 'month')) {
            monthStarts.push(currentDate.clone().endOf('month').format('YYYY-MM-DDT16:00:00.000Z'));
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
