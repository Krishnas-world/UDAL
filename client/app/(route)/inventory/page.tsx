import { useProtectedFetch } from'@/context/AuthContext'
import { useState, useEffect } from 'react';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await useProtectedFetch('/api/inventory');
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b">Drug Name</th>
              <th className="px-6 py-3 border-b">Current Stock</th>
              <th className="px-6 py-3 border-b">Reorder Threshold</th>
              <th className="px-6 py-3 border-b">Location</th>
              <th className="px-6 py-3 border-b">Notes</th>
              <th className="px-6 py-3 border-b">Low Stock</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item._id} className="border-b">
                <td className="px-6 py-4">{item.drugName}</td>
                <td className="px-6 py-4">{item.currentStock}</td>
                <td className="px-6 py-4">{item.reorderThreshold}</td>
                <td className="px-6 py-4">{item.location}</td>
                <td className="px-6 py-4">{item.notes}</td>
                <td className="px-6 py-4">
                  {item.isLowStock ? 'Yes' : 'No'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
