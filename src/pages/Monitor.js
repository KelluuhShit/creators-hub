// src/pages/Monitor.js
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler, Title, Legend, Tooltip } from 'chart.js';
import { IoClose, IoArrowUp, IoRemove, IoArrowDown } from 'react-icons/io5';
import './Monitor.css';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Title, Legend, Tooltip);

function Monitor() {
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('month');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate loading delay (replace with API call later)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const timePeriods = ['year', 'month', 'week', 'day'];

  // Mock chart data with unique datasets
  const getChartData = (label, dataPoints, borderColor = '#833AB4', backgroundColor = 'rgba(131, 58, 180, 0.2)') => ({
    labels: timePeriod === 'year' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] :
            timePeriod === 'month' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
            timePeriod === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            ['00:00', '06:00', '12:00', '18:00', '23:59'],
    datasets: [{
      label,
      data: dataPoints,
      borderColor,
      backgroundColor,
      fill: true,
      tension: 0.4,
    }],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
      tooltip: { enabled: true },
    },
    scales: { y: { beginAtZero: true } },
  };

  // Compute card metrics
  const getCardMetrics = (data, title) => {
    const sum = data.reduce((acc, val) => acc + val, 0);
    const avg = sum / data.length;
    const first = data[0];
    const last = data[data.length - 1];
    let trend, trendIcon, trendColor;
    if (last > first * 1.05) { // Up if last value is >5% higher
      trend = 'Up';
      trendIcon = <IoArrowUp />;
      trendColor = '#28a745'; // Green
    } else if (last < first * 0.95) { // Down if last value is <5% lower
      trend = 'Down';
      trendIcon = <IoArrowDown />;
      trendColor = '#dc3545'; // Red
    } else { // Stable if within ±5%
      trend = 'Stable';
      trendIcon = <IoRemove />;
      trendColor = '#ffc107';
    }
    let value;
    if (title === 'Likes' || title === 'Views' || title === 'Promoted Views') {
      value = `${Math.round(sum).toLocaleString()} Total`;
    } else if (title === 'Posts') {
      value = `${Math.round(sum)} Posts`;
    } else {
      value = `${Math.round(avg)}% Average`;
    }
    return { value, trend, trendIcon, trendColor };
  };

  const charts = [
    {
      title: 'Likes Chart',
      data: getChartData('Likes',
        timePeriod === 'year' ? [150, 200, 250, 300, 400, 350, 450, 500, 420, 380, 430, 470] :
        timePeriod === 'month' ? [200, 300, 450, 400] :
        timePeriod === 'week' ? [100, 120, 150, 200, 180, 250, 220] :
        [50, 80, 120, 100, 90]
      ),
      color: '#833AB4',
    },
    {
      title: 'Promoted Views Chart',
      data: getChartData('Promoted Views',
        timePeriod === 'year' ? [80, 120, 100, 150, 200, 180, 220, 250, 230, 200, 240, 260] :
        timePeriod === 'month' ? [100, 150, 200, 180] :
        timePeriod === 'week' ? [50, 60, 80, 100, 90, 120, 110] :
        [20, 30, 50, 40, 35],
        '#FD1D1D', 'rgba(253, 29, 29, 0.2)'
      ),
      color: '#FD1D1D',
    },
    {
      title: 'Consistency Chart',
      data: getChartData('Consistency',
        timePeriod === 'year' ? [60, 65, 70, 75, 80, 85, 80, 90, 95, 100, 105, 110] :
        timePeriod === 'month' ? [70, 75, 80, 85] :
        timePeriod === 'week' ? [60, 62, 65, 68, 70, 72, 75] :
        [50, 52, 55, 54, 53],
        '#FCAF45', 'rgba(252, 175, 69, 0.2)'
      ),
      color: '#FCAF45',
    },
    {
      title: 'Posts Chart',
      data: getChartData('Posts',
        timePeriod === 'year' ? [5, 8, 10, 12, 15, 14, 18, 20, 16, 15, 17, 19] :
        timePeriod === 'month' ? [8, 10, 12, 11] :
        timePeriod === 'week' ? [2, 3, 4, 5, 4, 6, 5] :
        [1, 2, 3, 2, 1]
      ),
      color: '#833AB4',
    },
    {
      title: 'Views Chart',
      data: getChartData('Views',
        timePeriod === 'year' ? [300, 350, 400, 450, 500, 480, 550, 600, 520, 490, 530, 570] :
        timePeriod === 'month' ? [400, 450, 500, 480] :
        timePeriod === 'week' ? [200, 220, 250, 300, 280, 350, 320] :
        [100, 150, 200, 180, 160]
      ),
      color: '#833AB4',
    },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="monitor-container">
      {isLoading ? (
        <div className="skeleton-container">
          <div className="skeleton-title"></div>
          <div className="skeleton-buttons"></div>
          <div className="skeleton-chart-row">
            <div className="skeleton-chart"></div>
            <div className="skeleton-chart"></div>
          </div>
          <div className="skeleton-button"></div>
          <div className="skeleton-card-grid">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="skeleton-card"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h1 className="monitor-title">Statistics Dashboard</h1>
          <div className="time-period-buttons">
            {timePeriods.map((period) => (
              <button
                key={period}
                className={`time-period-button ${timePeriod === period ? 'active' : ''}`}
                onClick={() => setTimePeriod(period)}
                aria-pressed={timePeriod === period}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <div className="chart-row">
            {charts.slice(0, 2).map((chart, index) => (
              <div key={index} className="chart-container">
                <h2 className="chart-title">{chart.title}</h2>
                <Line
                  data={chart.data}
                  options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: chart.title } } }}
                />
              </div>
            ))}
          </div>
          <button className="see-all-button" onClick={openModal}>
            See All
          </button>
          <div className="card-grid">
            {charts.map((chart, index) => {
              const { value, trendIcon, trendColor } = getCardMetrics(chart.data.datasets[0].data, chart.title);
              return (
                <div key={index} className="monitor-card" style={{ borderLeft: `4px solid ${chart.color}` }}>
                  <h2 className="monitor-card-title">{chart.title.replace(' Chart', '')}</h2>
                  <p className="monitor-card-value">{value}</p>
                  <span className="monitor-card-trend" style={{ color: trendColor }}>
                    {trendIcon}
                  </span>
                </div>
              );
            })}
          </div>
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <button className="modal-close" onClick={closeModal} aria-label="Close Modal">
                  <IoClose size={24} />
                </button>
                <h2 className="modal-title">All Statistics</h2>
                <div className="modal-charts">
                  {charts.map((chart, index) => (
                    <div key={index} className="chart-container">
                      <h3 className="chart-title">{chart.title}</h3>
                      <Line
                        data={chart.data}
                        options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: chart.title } } }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Monitor;