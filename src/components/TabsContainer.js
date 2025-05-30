import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import InterestRateDaily from './InterestRateDaily';
import InterestRateCycle from './InterestRateCycle';
import InterestRateReports from './InterestRateReports';
import InterestRateMaintenance from './InterestRateMaintenance';
import ParticipantsMaintenance from './ParticipantsMaintenance';

function TabsContainer() {
  return (
    <Tabs defaultActiveKey="daily" id="interest-rate-tabs" className="mb-3">
      <Tab eventKey="daily" title="Interest Rate - Daily">
        <InterestRateDaily />
      </Tab>
      <Tab eventKey="cycle" title="Interest Rate - Cycle">
        <InterestRateCycle />
      </Tab>
      <Tab eventKey="reports" title="Interest Rate - Reports">
        <InterestRateReports />
      </Tab>
      <Tab eventKey="maintenance" title="Interest Rate Maintenance">
        <InterestRateMaintenance />
      </Tab>
      <Tab eventKey="participants" title="Participants Maintenance">
        <ParticipantsMaintenance />
      </Tab>
    </Tabs>
  );
}

export default TabsContainer;
