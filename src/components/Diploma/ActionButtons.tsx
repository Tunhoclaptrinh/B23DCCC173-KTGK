import React from 'react';
import { Button } from 'antd';

const ActionButtons: React.FC<{
  onAdd: () => void;
  onViewStats: () => void;
}> = ({ onAdd, onViewStats }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
    <Button type="primary" onClick={onAdd}>
      Add Graduation Decision
    </Button>
    <Button type="default" onClick={onViewStats}>
      View Diploma Statistics
    </Button>
  </div>
);

export default ActionButtons;