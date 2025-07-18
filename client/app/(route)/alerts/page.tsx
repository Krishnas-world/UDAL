'use client';

import React, { useState, useEffect } from 'react';
import { useProtectedFetch } from'@/context/AuthContext'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    type: '',
    message: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await useProtectedFetch('/api/alerts');
      const data = await response.json();
      setAlerts(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
      setLoading(false);
    }
  };

  const triggerAlert = async () => {
    if (!newAlert.type || !newAlert.message) return;

    try {
      const response = await useProtectedFetch('/api/alerts/trigger', {
        method: 'POST',
        body: JSON.stringify(newAlert),
      });

      if (response.ok) {
        const data = await response.json();
        setAlerts([data, ...alerts]);
        setNewAlert({ type: '', message: '' });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger alert');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Emergency Alerts</h1>
      
      {/* Trigger New Alert Form */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Trigger New Alert</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
            <select
              value={newAlert.type}
              onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Alert Type</option>
              <option value="emergency">Emergency</option>
              <option value="maintenance">Maintenance</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              value={newAlert.message}
              onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>
          <button
            onClick={triggerAlert}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Trigger Alert
          </button>
        </div>
      </div>

      {/* Active Alerts List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Active Alerts</h2>
        <div className="space-y-4">
          {alerts.map((alert: any) => (
            <div
              key={alert._id}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    {alert.type}
                  </h3>
                  <p className="text-gray-600">{alert.message}</p>
                  <p className="text-sm text-gray-500">
                    Triggered at: {new Date(alert.triggeredAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
