import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import InterestRateDaily from './InterestRateDaily';
import InterestRateCycle from './InterestRateCycle';
import InterestRateReports from './InterestRateReports';
import InterestRateMaintenance from './InterestRateMaintenance';
import ParticipantsMaintenance from './ParticipantsMaintenance';

function TabsContainer() {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div>
      <Tabs
        id="interest-rate-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
        justify
      >
        <Tab eventKey="daily" title="Interest Rate - Daily" />
        <Tab eventKey="cycle" title="Interest Rate - Cycle" />
        <Tab eventKey="reports" title="Interest Rate - Reports" />
        <Tab eventKey="maintenance" title="Interest Rate Maintenance" />
        <Tab eventKey="participants" title="Participants Maintenance" />
      </Tabs>

      <div className="tab-content mt-3">
        {activeTab === 'daily' && <InterestRateDaily />}
        {activeTab === 'cycle' && <InterestRateCycle />}
        {activeTab === 'reports' && <InterestRateReports />}
        {activeTab === 'maintenance' && <InterestRateMaintenance />}
        {activeTab === 'participants' && <ParticipantsMaintenance />}
      </div>
    </div>
  );
}

export default TabsContainer;
