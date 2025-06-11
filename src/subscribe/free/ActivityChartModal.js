import { IoClose } from 'react-icons/io5';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import './ActivityChartModal.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ActivityChartModal({ isOpen, onClose, activity }) {
  if (!isOpen) return null;

  // Mock chart data based on activity
  const getChartData = (activity) => {
    const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
    let data, label;
    switch (activity) {
      case 'New post reached 500 views':
        data = [50, 100, 150, 200, 250, 300, 500];
        label = 'Views';
        break;
      case 'Gained 50 new followers':
        data = [5, 10, 15, 20, 30, 40, 50];
        label = 'Followers';
        break;
      case 'Post received 200 likes':
        data = [20, 40, 60, 80, 120, 160, 200];
        label = 'Likes';
        break;
      case '10 new comments on post':
        data = [1, 2, 3, 4, 6, 8, 10];
        label = 'Comments';
        break;
      default:
        data = [0, 0, 0, 0, 0, 0, 0];
        label = 'Data';
    }
    return { labels, data, label };
  };

  const { labels, data, label } = getChartData(activity);

  // Chart.js data and options
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: '#833AB4',
        backgroundColor: 'rgba(131, 58, 180, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days',
          color: '#333',
        },
        ticks: {
          color: '#555',
        },
      },
      y: {
        title: {
          display: true,
          text: label,
          color: '#333',
        },
        ticks: {
          color: '#555',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-modal-overlay" onClick={onClose}>
      <div className="chart-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="chart-modal-close-button" onClick={onClose} aria-label="Close chart modal">
          <IoClose />
        </button>
        <h2 className="chart-modal-title">Activity Trend: {activity}</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default ActivityChartModal;