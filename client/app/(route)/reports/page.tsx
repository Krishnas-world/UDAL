'use client';

import React, { useState, useEffect } from 'react';
import { useProtectedFetch } from'@/context/AuthContext'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [scheduleData, setScheduleData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab, dateRange]);

  const fetchReport = async (reportType: string) => {
    try {
      const response = await useProtectedFetch(`/api/reports/${reportType}-summary`, {
        method: 'GET',
        params: dateRange,
      });
      const data = await response.json();
      
      switch (reportType) {
        case 'schedule':
          setScheduleData(data);
          break;
        case 'inventory':
          setInventoryData(data);
          break;
        case 'audit':
          setAuditData(data);
          break;
      }
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch report');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      {/* Date Range Filter */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => fetchReport(activeTab)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedule'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Schedule Summary
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inventory'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Inventory Overview
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'audit'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Audit Log Summary
          </button>
        </nav>
      </div>

      {/* Report Content */}
      <div className="mt-6">
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduleData.map((department: any) => (
              <div
                key={department._id}
                className="bg-white p-6 rounded-lg shadow"
              >
                <h3 className="text-lg font-semibold mb-2">{department._id}</h3>
                <p className="text-gray-600">Total Schedules: {department.totalSchedules}</p>
                <p className="text-gray-600">Completed: {department.completed}</p>
                <p className="text-gray-600">Cancelled: {department.cancelled}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventoryData.map((item: any) => (
              <div
                key={item._id}
                className={`bg-white p-6 rounded-lg shadow ${
                  item.isLowStock ? 'border-l-4 border-red-500' : ''
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{item.drugName}</h3>
                <p className="text-gray-600">Current Stock: {item.currentStock}</p>
                <p className="text-gray-600">Reorder Threshold: {item.reorderThreshold}</p>
                {item.isLowStock && (
                  <span className="mt-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Low Stock Alert
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unique Users
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {auditData.map((log: any) => (
                  <tr key={log._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.totalActions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.usersAffected.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
