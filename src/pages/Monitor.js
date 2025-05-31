// src/pages/Monitor.js
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js';
import './Monitor.css';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler);

function Monitor() {
  const chartData = {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Post Engagement',
        data: [120, 190, 300, 500, 400],
        borderColor: '#833AB4',
        backgroundColor: 'rgba(131, 58, 180, 0.2)',
        fill: true,
      }],
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } },
    },
  };

  return (
    <div className="monitor-container">
      <h1 className="monitor-title">Analytics Dashboard</h1>
      <div className="monitor-card">
        <h2 className="monitor-card-title">Post Engagement</h2>
        <p className="monitor-card-value">1,234 Likes</p>
      </div>
      <div className="monitor-card">
        <h2 className="monitor-card-title">Follower Growth</h2>
        <p className="monitor-card-value">+56 this week</p>
      </div>
      <Line data={chartData.data} options={chartData.options} />
    </div>
  );
}

export default Monitor;