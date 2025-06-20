
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ReportsScreen = () => {
  const [activeReport, setActiveReport] = useState('sales');

  // Demo data
  const salesData = [
    { date: '2024-01-10', sales: 450.25, bills: 12 },
    { date: '2024-01-11', sales: 380.50, bills: 8 },
    { date: '2024-01-12', sales: 520.75, bills: 15 },
    { date: '2024-01-13', sales: 345.00, bills: 9 },
    { date: '2024-01-14', sales: 675.25, bills: 18 },
    { date: '2024-01-15', sales: 420.50, bills: 11 }
  ];

  const categoryData = [
    { name: 'Dairy', value: 35, color: '#3B82F6' },
    { name: 'Fresh', value: 25, color: '#10B981' },
    { name: 'Meat', value: 20, color: '#F59E0B' },
    { name: 'Bakery', value: 12, color: '#EF4444' },
    { name: 'Grains', value: 8, color: '#8B5CF6' }
  ];

  const topProducts = [
    { name: 'Milk', sales: 85, revenue: 297.50 },
    { name: 'Bread', sales: 64, revenue: 160.00 },
    { name: 'Eggs', sales: 43, revenue: 516.00 },
    { name: 'Chicken', sales: 38, revenue: 950.00 },
    { name: 'Vegetables', sales: 35, revenue: 297.50 }
  ];

  const reports = [
    { id: 'sales', name: 'Sales Report', icon: '💰' },
    { id: 'products', name: 'Product Performance', icon: '📊' },
    { id: 'categories', name: 'Category Analysis', icon: '🏷️' }
  ];

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              ${salesData.reduce((sum, day) => sum + day.sales, 0).toFixed(2)}
            </div>
            <div className="text-green-100">Total Sales (6 days)</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {salesData.reduce((sum, day) => sum + day.bills, 0)}
            </div>
            <div className="text-blue-100">Total Bills</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              ${(salesData.reduce((sum, day) => sum + day.sales, 0) / salesData.reduce((sum, day) => sum + day.bills, 0)).toFixed(2)}
            </div>
            <div className="text-purple-100">Average Bill</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Sales Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderProductReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-700">Product</th>
                <th className="text-center p-3 font-semibold text-gray-700">Units Sold</th>
                <th className="text-right p-3 font-semibold text-gray-700">Revenue</th>
                <th className="text-center p-3 font-semibold text-gray-700">Performance</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={product.name} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium text-gray-800">
                    <span className="mr-2 text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📦'}</span>
                    {product.name}
                  </td>
                  <td className="p-3 text-center font-semibold">{product.sales}</td>
                  <td className="p-3 text-right font-semibold text-green-600">${product.revenue.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <Badge variant={index < 2 ? "default" : "secondary"}>
                      {index < 2 ? "Excellent" : index < 4 ? "Good" : "Fair"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const renderCategoryReport = () => (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-3">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className="font-semibold">{category.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderReportContent = () => {
    switch (activeReport) {
      case 'products':
        return renderProductReport();
      case 'categories':
        return renderCategoryReport();
      default:
        return renderSalesReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Navigation */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-lg shadow-sm">
        {reports.map((report) => (
          <Button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            variant={activeReport === report.id ? "default" : "ghost"}
            className={`flex items-center gap-2 transition-all duration-200 ${
              activeReport === report.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'hover:bg-gray-100'
            }`}
          >
            <span>{report.icon}</span>
            {report.name}
          </Button>
        ))}
      </div>

      {/* Report Content */}
      {renderReportContent()}

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              Export as PDF
            </Button>
            <Button variant="outline" className="flex-1">
              Export as Excel
            </Button>
            <Button variant="outline" className="flex-1">
              Print Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsScreen;
