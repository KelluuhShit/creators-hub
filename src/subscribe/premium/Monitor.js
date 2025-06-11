// src/pages/Monitor.js
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, PointElement, LinearScale, CategoryScale, Title, Legend, Tooltip } from 'chart.js';
import { IoArrowUp, IoRemove, IoArrowDown, IoInformationCircleOutline, IoClose } from 'react-icons/io5';
import './Monitor.css';

// Register Chart.js components
ChartJS.register(BarElement, PointElement, LinearScale, CategoryScale, Title, Legend, Tooltip);

function Monitor() {
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('month');
  const [error, setError] = useState(null);
  const [modalChart, setModalChart] = useState(null); // State for modal
  const navigate = useNavigate();

  // Simulate loading delay (replace with API call later)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const timePeriods = ['year', 'month', 'week', 'day'];

  // Mock chart data with unique datasets and rounded bars
  const getChartData = (label, dataPoints, borderColor = '#833AB4', backgroundColor = 'rgba(131, 58, 180, 0.6)') => ({
    labels: timePeriod === 'year' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] :
            timePeriod === 'month' ? ['Week 1', 'Week 2', 'Week 3', 'Week 4'] :
            timePeriod === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            ['00:00', '06:00', '12:00', '18:00', '23:59'],
    datasets: [{
      label,
      data: dataPoints,
      borderColor,
      backgroundColor,
      borderWidth: 1,
      borderRadius: 3,
      barThickness: 20, // Narrow bars
    }],
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: '' },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
      x: { ticks: { font: { size: 10 } } },
    },
    maintainAspectRatio: false,
  };

  // Compute card metrics
  const getCardMetrics = (data, title) => {
    const sum = data.reduce((acc, val) => acc + val, 0); // Total count
    const first = data[0] || 0; // Default to 0 if no data
    const last = data[data.length - 1] || 0; // Default to 0 if no data
    const percentageChange = first !== 0 ? ((last - first) / first * 100).toFixed(1) : 0; // Percentage change
    let trend, trendIcon, trendColor;
    if (last > first * 1.05) {
      trend = 'Up';
      trendIcon = <IoArrowUp />;
      trendColor = '#28a745'; // Green
    } else if (last < first * 0.95) {
      trend = 'Down';
      trendIcon = <IoArrowDown />;
      trendColor = '#dc3545'; // Red
    } else {
      trend = 'Stable';
      trendIcon = <IoRemove />;
      trendColor = '#ffc107'; // Yellow
    }
    const value = Math.round(sum).toLocaleString(); // Format total count
    return { value, trend, trendIcon, trendColor, percentageChange }; // Include trend
  };

  // Mock descriptions for each metric
  const getMetricDescription = (title) => {
    const descriptions = {
      'Likes Chart': 'Total Likes measures user engagement through positive interactions with your content over the selected time period.',
      'Promoted Views Chart': 'Promoted Views tracks the number of views driven by paid promotions, reflecting the effectiveness of your advertising efforts.',
      'Consistency Chart': 'Consistency represents the total activity level of your content performance over the selected time period.',
      'Posts Chart': 'Posts counts the number of content items published, indicating your content creation activity.',
      'Views Chart': 'Total Views measures the overall reach of your content, including both organic and promoted views.',
    };
    return descriptions[title] || 'No description available.';
  };

  const charts = useMemo(() => [
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
        '#FD1D1D', 'rgba(253, 29, 29, 0.6)'
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
        '#FCAF45', 'rgba(252, 175, 69, 0.6)'
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
  ], [timePeriod]);

  const handleRevenueClick = () => navigate('/revenue');

  const handleOpenModal = (chart) => setModalChart(chart);
  const handleCloseModal = () => setModalChart(null);

  return (
    <div className="monitor-container">
      {isLoading ? (
        <div className="skeleton-container">
          <div className="skeleton-title"></div>
          <div className="skeleton-buttons"></div>
          <div className="skeleton-chart-row">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="skeleton-chart"></div>
            ))}
          </div>
          <div className="skeleton-card-grid">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="skeleton-card"></div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : (
        <>
          <div className="monitor-header">
            <h4 className="monitor-title">Statistics Dashboard</h4>
            <button className="open-revenue" onClick={handleRevenueClick} aria-label="View revenue statistics">
              Revenue
            </button>
          </div>
          <div className="time-period-buttons">
            {timePeriods.map((period) => (
              <button
                key={period}
                className={`time-period-button ${timePeriod === period ? 'active' : ''}`}
                onClick={() => setTimePeriod(period)}
                aria-pressed={timePeriod === period}
                aria-label={`View statistics for ${period}`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
          <div className="chart-scroll-container">
            <div className="chart-row">
              {charts.map((chart, index) => (
                <div key={index} className="chart-container">
                  <div className="chart-wrapper">
                    <Bar
                      data={chart.data}
                      options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: chart.title } } }}
                      height={200}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card-grid">
            {charts.map((chart, index) => {
              const { value, trend, trendIcon, trendColor, percentageChange } = getCardMetrics(chart.data.datasets[0].data, chart.title);
              return (
                <div key={index} className="monitor-card" style={{ borderLeft: `4px solid ${chart.color}` }}>
                  <div className="monitor-card-header">
                    <h2 className="monitor-card-title">{chart.title.replace(' Chart', '')}</h2>
                    <button
                      className="info-icon"
                      onClick={() => handleOpenModal(chart)}
                      aria-label={`View details for ${chart.title.replace(' Chart', '')}`}
                    >
                      <IoInformationCircleOutline />
                    </button>
                  </div>
                  <div className="monitor-card-metrics" aria-label={`${value} total, ${trend} trend, ${percentageChange}% change`}>
                    <span className="monitor-card-value">{value}</span>
                    <span className="monitor-card-trend" style={{ color: trendColor }}>
                      {trendIcon}
                    </span>
                    <span className="monitor-card-percentage">{percentageChange}%</span>
                  </div>
                </div>
              );
            })}
          </div>
          {modalChart && (
            <div className="modal-overlay" onClick={handleCloseModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseModal} aria-label="Close modal">
                  <IoClose />
                </button>
                <h2 className="modal-title">{modalChart.title}</h2>
                <div className="modal-chart-wrapper">
                  <Bar
                    data={modalChart.data}
                    options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: modalChart.title } } }}
                    height={300}
                  />
                </div>
                <p className="modal-description">{getMetricDescription(modalChart.title)}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Monitor;