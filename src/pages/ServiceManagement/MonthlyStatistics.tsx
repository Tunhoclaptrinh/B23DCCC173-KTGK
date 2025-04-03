import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Card, Table, Statistic } from 'antd';
import moment from 'moment';

const MonthlyStatistics = () => {
  const { appointments, services } = useModel('ServiceManagement.appointment');
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    const stats = {};

    appointments.forEach(appointment => {
      const month = moment(appointment.date).format('YYYY-MM');
      if (!stats[month]) {
        stats[month] = { revenue: 0, totalAppointments: 0, serviceCounts: {} };
      }
      
      const service = services.find(s => s.dichvu_id === appointment.dichvu_id);
      if (service) {
        stats[month].revenue += service.price;
        stats[month].totalAppointments += 1;
        stats[month].serviceCounts[service.name] = (stats[month].serviceCounts[service.name] || 0) + 1;
      }
    });

    setMonthlyData(stats);
  }, [appointments, services]);

  const columns = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Total Revenue', dataIndex: 'revenue', key: 'revenue', render: value => `$${value.toFixed(2)}` },
    { title: 'Total Appointments', dataIndex: 'totalAppointments', key: 'totalAppointments' },
    { title: 'Most Popular Service', dataIndex: 'popularService', key: 'popularService' },
  ];

  const dataSource = Object.keys(monthlyData).map(month => {
    const { revenue, totalAppointments, serviceCounts } = monthlyData[month];
    const popularService = Object.keys(serviceCounts).reduce((a, b) => serviceCounts[a] > serviceCounts[b] ? a : b, 'N/A');
    return { key: month, month, revenue, totalAppointments, popularService };
  });

  return (
    <Card title="Monthly Statistics" style={{ marginTop: 20 }}>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </Card>
  );
};

export default MonthlyStatistics;
