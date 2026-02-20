
import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, AlertTriangle, Clock, Filter } from 'lucide-react';
import { getMaintenanceTickets, createWorkOrder, updateTicketStatus } from '../services/db';
import { MaintenanceTicket, TicketStatus, TicketPriority } from '../types';
import { Button } from '../components/ui/Button';

export const AdminWorkOrders: React.FC = () => {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newTicket, setNewTicket] = useState<Partial<MaintenanceTicket>>({});

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const data = await getMaintenanceTickets();
    setTickets(data);
  };

  const handleCreate = async () => {
    if(!newTicket.issueDescription) return;
    await createWorkOrder(newTicket);
    setNewTicket({});
    setIsFormOpen(false);
    loadTickets();
  };

  const getStatusColor = (s: string) => s === 'OPEN' ? 'bg-red-100 text-red-700' : s === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Work Orders</h1>
          <p className="text-slate-500">Manage maintenance and housekeeping tasks</p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)}>
          <Plus size={18} className="mr-2"/> New Order
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-blue-100 space-y-4 animate-in slide-in-from-top-2">
           <h3 className="font-bold">Create New Ticket</h3>
           <div className="grid grid-cols-2 gap-4">
             <input placeholder="Room Number" className="p-2 border rounded" onChange={e => setNewTicket({...newTicket, roomNumber: e.target.value})} />
             <select className="p-2 border rounded" onChange={e => setNewTicket({...newTicket, priority: e.target.value as TicketPriority})}>
               <option value="LOW">Low Priority</option>
               <option value="MEDIUM">Medium</option>
               <option value="HIGH">High</option>
               <option value="URGENT">Urgent</option>
             </select>
             <input placeholder="Description" className="col-span-2 p-2 border rounded" onChange={e => setNewTicket({...newTicket, issueDescription: e.target.value})} />
           </div>
           <Button onClick={handleCreate}>Submit Order</Button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Issue</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Assigned To</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map(t => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-xs font-mono text-slate-400">#{t.id.slice(0,6)}</td>
                <td className="px-6 py-4 font-bold">{t.roomNumber}</td>
                <td className="px-6 py-4">{t.issueDescription}</td>
                <td className="px-6 py-4"><span className={`text-xs font-bold px-2 py-1 rounded ${t.priority === 'URGENT' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'}`}>{t.priority}</span></td>
                <td className="px-6 py-4 text-slate-500">{t.assignedTo || 'Unassigned'}</td>
                <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded font-bold ${getStatusColor(t.status)}`}>{t.status}</span></td>
                <td className="px-6 py-4">
                  {t.status !== TicketStatus.DONE && (
                    <button onClick={async () => { await updateTicketStatus(t.id, TicketStatus.DONE); loadTickets(); }} className="text-blue-600 hover:underline">Mark Done</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
