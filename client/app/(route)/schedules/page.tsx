import { useProtectedFetch } from '@/lib/api';
import { useState, useEffect } from 'react';

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await useProtectedFetch('/api/schedules');
        const data = await response.json();
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Schedules</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Patient Token</th>
              <th className="px-6 py-3 border-b">Department</th>
              <th className="px-6 py-3 border-b">Type</th>
              <th className="px-6 py-3 border-b">Scheduled Time</th>
              <th className="px-6 py-3 border-b">Doctor</th>
              <th className="px-6 py-3 border-b">Room</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule._id} className="border-b">
                <td className="px-6 py-4">{schedule.patientToken}</td>
                <td className="px-6 py-4">{schedule.department}</td>
                <td className="px-6 py-4">{schedule.type}</td>
                <td className="px-6 py-4">{schedule.scheduledTime}</td>
                <td className="px-6 py-4">{schedule.doctorName}</td>
                <td className="px-6 py-4">{schedule.roomNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
