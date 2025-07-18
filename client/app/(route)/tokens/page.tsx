import { useProtectedFetch } from'@/context/AuthContext'
import { useState, useEffect } from 'react';

export default function TokensPage() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('');

  const fetchToken = async () => {
    try {
      const response = await useProtectedFetch(`/api/tokens/${department}`);
      const data = await response.json();
      setTokens([data]); // Store as array for consistent rendering
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  const advanceToken = async () => {
    try {
      const response = await useProtectedFetch(
        `/api/tokens/${department}/advance`,
        { method: 'PUT' }
      );
      const data = await response.json();
      setTokens([data]);
    } catch (error) {
      console.error('Error advancing token:', error);
    }
  };

  useEffect(() => {
    if (department) {
      fetchToken();
    }
  }, [department]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tokens</h1>
      <div className="mb-4">
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="">Select Department</option>
          <option value="ot">OT</option>
          <option value="pharmacy">Pharmacy</option>
        </select>
      </div>
      {department && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b">Department</th>
                <th className="px-6 py-3 border-b">Current Token</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <tr key={token.department} className="border-b">
                  <td className="px-6 py-4">{token.department}</td>
                  <td className="px-6 py-4">{token.currentToken}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={advanceToken}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Advance Token
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
