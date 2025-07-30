.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
}

.card-title {
  color: #555;
  font-size: 14px;
  margin-bottom: 8px;
}

.card-value {
  font-size: 20px;
  font-weight: bold;
}

.status-green {
  color: green;
}

.status-red {
  color: red;
}


import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState({
    cycleDate: '',
    interestRate: '',
    dailyJobStatus: '',
    lastCycleJobStatus: '',
  });

  useEffect(() => {
    // Simulated data
    setTimeout(() => {
      setData({
        cycleDate: '2025-07-29',
        interestRate: 5.25,
        dailyJobStatus: 'Completed',
        lastCycleJobStatus: 'Failed',
      });
    }, 500);
  }, []);

  const getStatusClass = (status) =>
    status.toLowerCase().includes('fail') ? 'status-red' : 'status-green';

  return (
    <div className="dashboard">
      <div className="card">
        <div className="card-title">Current Cycle Date</div>
        <div className="card-value">{data.cycleDate}</div>
      </div>
      <div className="card">
        <div className="card-title">Current Interest Rate</div>
        <div className="card-value">{data.interestRate}%</div>
      </div>
      <div className="card">
        <div className="card-title">Daily Job Status</div>
        <div className={`card-value ${getStatusClass(data.dailyJobStatus)}`}>
          {data.dailyJobStatus}
        </div>
      </div>
      <div className="card">
        <div className="card-title">Last Cycle Job Status</div>
        <div className={`card-value ${getStatusClass(data.lastCycleJobStatus)}`}>
          {data.lastCycleJobStatus}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;