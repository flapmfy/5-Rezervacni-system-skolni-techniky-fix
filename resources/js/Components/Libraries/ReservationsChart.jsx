import {
  AreaChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
} from 'recharts';
import { format } from 'date-fns';
// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="rounded border border-gray-600 bg-white-50/80 p-2 text-black-950 shadow">
        <p className="font-bold">{format(dataPoint.date, 'dd.MM.yyyy')}</p>
        <p>Nové rezervace: {dataPoint.count}</p>
      </div>
    );
  }
  return null;
};

const ChartComponent = ({ data }) => (
  <ResponsiveContainer width="100%" height={200}>
    <AreaChart
      data={data}
      margin={{
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    >
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="15%" stopColor="#16a34a" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Tooltip content={CustomTooltip} />
      <Area type="linear" dataKey="count" stroke="green" strokeWidth={3} fill="url(#gradient)" />
    </AreaChart>
  </ResponsiveContainer>
);

export default ChartComponent;
