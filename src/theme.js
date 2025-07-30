import React, { useEffect, useState } from 'react';

const StatusCard = ({ title, value, statusColor }) => { return ( <div className="bg-white p-4 rounded-2xl shadow text-center"> <h4 className="text-gray-600 text-sm mb-1">{title}</h4> <p className={text-xl font-semibold ${statusColor ? text-${statusColor}-600 : 'text-black'}}> {value} </p> </div> ); };

const getColor = (status) => { if (!status) return 'gray'; return status.toLowerCase().includes('fail') ? 'red' : 'green'; };

const Dashboard = () => { const [data, setData] = useState({ cycleDate: '', interestRate: '', dailyJobStatus: '', lastCycleJobStatus: '', });

useEffect(() => { // Simulated API call setTimeout(() => { setData({ cycleDate: '2025-07-29', interestRate: 5.25, dailyJobStatus: 'Completed', lastCycleJobStatus: 'Failed', }); }, 500); }, []);

return ( <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> <StatusCard title="Current Cycle Date" value={data.cycleDate || 'N/A'} /> <StatusCard title="Current Interest Rate" value={${data.interestRate}%} /> <StatusCard title="Daily Job Status" value={data.dailyJobStatus || 'N/A'} statusColor={getColor(data.dailyJobStatus)} /> <StatusCard title="Last Cycle Job Status" value={data.lastCycleJobStatus || 'N/A'} statusColor={getColor(data.lastCycleJobStatus)} /> </div> ); };

export default Dashboard;