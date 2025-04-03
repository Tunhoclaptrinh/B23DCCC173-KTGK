import React from 'react';
import { Modal } from 'antd';

const StatsModal: React.FC<{
  visible: boolean;
  stats: any;
  onCancel: () => void;
}> = ({ visible, stats, onCancel }) => (
  <Modal
    title="Diploma Statistics"
    visible={visible}
    footer={null}
    onCancel={onCancel}
  >
    <div>
      <p><strong>Total Diplomas:</strong> {stats.totalDiplomas}</p>
      <p><strong>Total Books:</strong> {stats.totalBooks}</p>
      <p><strong>Total Graduation Decisions:</strong> {stats.totalDecisions}</p>
      <p><strong>Total Lookups:</strong> {stats.totalLookups}</p>
      
      <h3>Diplomas by Year:</h3>
      <ul>
        {Object.entries(stats.diplomasByYear).map(([year, count]) => (
          <li key={year}>{year}: {count} diplomas</li>
        ))}
      </ul>
    </div>
  </Modal>
);

export default StatsModal;