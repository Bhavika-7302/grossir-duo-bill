
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SalesScreen from './SalesScreen';
import InventoryScreen from './InventoryScreen';
import ReportsScreen from './ReportsScreen';
import BillViewModal from './BillViewModal';

interface Bill {
  id: string;
  billNo: string;
  total: number;
  timestamp: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Demo bills data
  const [bills] = useState<Bill[]>([
    {
      id: '1',
      billNo: 'BILL-001',
      total: 45.50,
      timestamp: '2024-01-15 14:30:25',
      items: [
        { name: 'Milk', quantity: 2, price: 3.50, total: 7.00 },
        { name: 'Bread', quantity: 1, price: 2.50, total: 2.50 },
        { name: 'Eggs', quantity: 3, price: 12.00, total: 36.00 }
      ]
    },
    {
      id: '2',
      billNo: 'BILL-002',
      total: 23.75,
      timestamp: '2024-01-15 15:45:10',
      items: [
        { name: 'Rice', quantity: 1, price: 15.00, total: 15.00 },
        { name: 'Salt', quantity: 2, price: 4.25, total: 8.50 }
      ]
    },
    {
      id: '3',
      billNo: 'BILL-003',
      total: 67.25,
      timestamp: '2024-01-15 16:20:45',
      items: [
        { name: 'Chicken', quantity: 1, price: 25.00, total: 25.00 },
        { name: 'Vegetables', quantity: 2, price: 8.50, total: 17.00 },
        { name: 'Fruits', quantity: 3, price: 8.25, total: 25.25 }
      ]
    }
  ]);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'sales', name: 'Sales', icon: '💰' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'reports', name: 'Reports', icon: '📈' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sales':
        return <SalesScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'reports':
        return <ReportsScreen />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{bills.length}</div>
                  <div className="text-blue-100">Total Bills</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">${bills.reduce((sum, bill) => sum + bill.total, 0).toFixed(2)}</div>
                  <div className="text-green-100">Total Sales</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">${(bills.reduce((sum, bill) => sum + bill.total, 0) / bills.length).toFixed(2)}</div>
                  <div className="text-purple-100">Average Bill</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">42</div>
                  <div className="text-orange-100">Items in Stock</div>
                </CardContent>
              </Card>
            </div>

            {/* Bills Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Recent Bills
                  <Badge variant="secondary">{bills.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-3 font-semibold text-gray-700">Bill No</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Timestamp</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Total Amount</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map((bill) => (
                        <tr key={bill.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-3 font-medium text-blue-600">{bill.billNo}</td>
                          <td className="p-3 text-gray-600">{bill.timestamp}</td>
                          <td className="p-3 text-right font-semibold text-green-600">${bill.total.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <Button
                              onClick={() => setSelectedBill(bill)}
                              size="sm"
                              className="bg-blue-500 hover:bg-blue-600"
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variant={activeTab === tab.id ? "default" : "ghost"}
            className={`flex items-center gap-2 transition-all duration-200 ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-gray-100'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Bill View Modal */}
      {selectedBill && (
        <BillViewModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
