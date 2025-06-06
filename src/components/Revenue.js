// src/pages/Revenue.js
import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, PointElement, LinearScale, CategoryScale, Title, Legend, Tooltip } from 'chart.js';
import './Revenue.css';

// Register Chart.js components
ChartJS.register(BarElement, PointElement, LinearScale, CategoryScale, Title, Legend, Tooltip);

function Revenue() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [timePeriod, setTimePeriod] = useState('month');
  const [balance, setBalance] = useState(null); // Store balance

  const timePeriods = ['year', 'month', 'week', 'day'];
  const RPM = 0.5; // Revenue Per Mille ($0.5 per 1000 impressions)

  // Update balance from navigation state if available
  useEffect(() => {
    if (state?.newBalance !== undefined) {
      setBalance(state.newBalance);
    }
  }, [state]);

  // Mock chart data
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

  const charts = useMemo(() => [
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
      title: 'Views Chart',
      data: getChartData('Views',
        timePeriod === 'year' ? [300, 350, 400, 450, 500, 480, 550, 600, 520, 490, 530, 570] :
        timePeriod === 'month' ? [400, 450, 500, 480] :
        timePeriod === 'week' ? [200, 220, 250, 300, 280, 350, 320] :
        [100, 150, 200, 180, 160],
        '#833AB4', 'rgba(131, 58, 180, 0.6)'
      ),
      color: '#833AB4',
    },
  ], [timePeriod]);

  // Calculate revenue based on Promoted Views and RPM (numeric)
  const calculateRevenue = () => {
    const promotedViews = charts[0].data.datasets[0].data;
    const totalImpressions = promotedViews.reduce((acc, val) => acc + val, 0);
    return (totalImpressions / 1000) * RPM; // Return numeric value
  };

  // Use calculated revenue if no balance set
  const currentBalance = balance !== null ? balance : calculateRevenue();

  // Calculate performance metrics
  const calculatePerformanceMetrics = useMemo(() => {
    const promotedViews = charts[0].data.datasets[0].data;
    const views = charts[1].data.datasets[0].data;
    const totalImpressions = promotedViews.reduce((acc, val) => acc + val, 0);
    const totalViews = views.reduce((acc, val) => acc + val, 0);
    const revenue = (totalImpressions / 1000) * RPM;
    const accountWorth = revenue * 10;
    return {
      accountWorth: accountWorth.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      totalViews: totalViews.toLocaleString('en-US'),
      averageRPM: RPM.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    };
  }, [charts]);

  const handleBackClick = () => navigate('/monitor');

  const handlePayoutClick = () => {
    navigate('/earnings-summary', { state: { balance: currentBalance } });
  };

  return (
    <div className="revenue-container">
      <div className="revenue-header">
        <h4 className="revenue-title">Revenue Statistics</h4>
        <button className="back-button" onClick={handleBackClick} aria-label="Back to dashboard">
          Back
        </button>
      </div>
      <h5 className="estimated-revenue-title">Estimated Revenue</h5>
      <div className="currency-section">
        <div className="currency-item">
          <span className="currency-label">Revenue (USD):</span>
          <span className="currency-value">{currentBalance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
        </div>
        <div className="currency-item">
          <span className="currency-label">RPM:</span>
          <span className="currency-value">{RPM.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
        </div>
      </div>
      <div className="time-period-buttons">
        {timePeriods.map((period) => (
          <button
            key={period}
            className={`time-period-button ${timePeriod === period ? 'active' : ''}`}
            onClick={() => setTimePeriod(period)}
            aria-pressed={timePeriod === period}
            aria-label={`View revenue statistics for ${period}`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>
      <div className="chart-scroll-container">
        <div className="chart-row">
          {charts.map((chart, index) => (
            <div key={index} className="chart-container">
              <h2 className="chart-title">{chart.title}</h2>
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
      <div className="performance-card">
        <div className="performance-item">
          <span className="performance-label">Account Worth:</span>
          <span className="performance-value">{calculatePerformanceMetrics.accountWorth}</span>
        </div>
        <div className="performance-item">
          <span className="performance-label">Views:</span>
          <span className="performance-value">{calculatePerformanceMetrics.totalViews}</span>
        </div>
        <div className="performance-item">
          <span className="performance-label">Average RPM:</span>
          <span className="performance-value">{calculatePerformanceMetrics.averageRPM}</span>
        </div>
      </div>
      <div className="action-button-container">
        <button className="action-button" onClick={handlePayoutClick} aria-label="Go to payout">
          Payout
        </button>
      </div>
    </div>
  );
}

export default Revenue;