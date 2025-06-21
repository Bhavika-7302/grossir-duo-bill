import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, Download, FileText, FileSpreadsheet } from 'lucide-react';
import PincodeModal from './PincodeModal';

const ReportsScreen = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [downloadType, setDownloadType] = useState('');

  // Demo data with bill numbers
  const salesData = [
    { date: '2024-01-10', sales: 450.25, bills: 12 },
    { date: '2024-01-11', sales: 380.50, bills: 8 },
    { date: '2024-01-12', sales: 520.75, bills: 15 },
    { date: '2024-01-13', sales: 345.00, bills: 9 },
    { date: '2024-01-14', sales: 675.25, bills: 18 },
    { date: '2024-01-15', sales: 420.50, bills: 11 }
  ];

  const billsData = [
    { billNo: 'VV00001', customerName: 'రాజేష్ / Rajesh', phone: '9876543210', total: 245.50, date: '2024-01-15' },
    { billNo: 'VV00002', customerName: 'సీతా / Sita', phone: '9876543211', total: 180.75, date: '2024-01-15' },
    { billNo: 'VV00003', customerName: 'రాము / Ramu', phone: '9876543212', total: 320.25, date: '2024-01-14' },
    { billNo: 'VV00004', customerName: 'గీతా / Gita', phone: '9876543213', total: 150.00, date: '2024-01-14' },
    { billNo: 'VV00005', customerName: 'కృష్ణ / Krishna', phone: '9876543214', total: 425.80, date: '2024-01-13' }
  ];

  const categoryData = [
    { name: 'డెయిరీ / Dairy', value: 35, color: '#3B82F6' },
    { name: 'తాజా / Fresh', value: 25, color: '#10B981' },
    { name: 'మాంసం / Meat', value: 20, color: '#F59E0B' },
    { name: 'బేకరీ / Bakery', value: 12, color: '#EF4444' },
    { name: 'ధాన్యాలు / Grains', value: 8, color: '#8B5CF6' }
  ];

  const topProducts = [
    { name: 'మిల్క్ / Milk', sales: 85, revenue: 297.50 },
    { name: 'బ్రెడ్ / Bread', sales: 64, revenue: 160.00 },
    { name: 'గుడ్లు / Eggs', sales: 43, revenue: 516.00 },
    { name: 'చికెన్ / Chicken', sales: 38, revenue: 950.00 },
    { name: 'కూరగాయలు / Vegetables', sales: 35, revenue: 297.50 }
  ];

  const reports = [
    { id: 'sales', name: 'విక్రయాల నివేదిక / Sales Report', icon: '💰' },
    { id: 'products', name: 'ఉత్పత్తి పనితీరు / Product Performance', icon: '📊' },
    { id: 'categories', name: 'వర్గ విశ్లేషణ / Category Analysis', icon: '🏷️' },
    { id: 'bills', name: 'బిల్ చరిత్ర / Bill History', icon: '📄' }
  ];

  const filteredBills = billsData.filter(bill =>
    bill.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.phone.includes(searchTerm)
  );

  const handleDownload = (type: string) => {
    setDownloadType(type);
    setShowPincodeModal(true);
  };

  const handleDownloadSuccess = () => {
    // Simulate download
    const element = document.createElement('a');
    const file = new Blob(['Sample report data'], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${downloadType}-${Date.now()}.${downloadType.includes('Excel') ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert(`${downloadType} విజయవంతంగా డౌన్‌లోడ్ చేయబడింది! / ${downloadType} downloaded successfully!`);
  };

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              ₹{salesData.reduce((sum, day) => sum + day.sales, 0).toFixed(2)}
            </div>
            <div className="text-green-100">మొత్తం విక్రయాలు / Total Sales (6 days)</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {salesData.reduce((sum, day) => sum + day.bills, 0)}
            </div>
            <div className="text-blue-100">మొత్తం బిల్లులు / Total Bills</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              ₹{(salesData.reduce((sum, day) => sum + day.sales, 0) / salesData.reduce((sum, day) => sum + day.bills, 0)).toFixed(2)}
            </div>
            <div className="text-purple-100">సగటు బిల్ / Average Bill</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>రోజువారీ విక్రయాల ధోరణి / Daily Sales Trend</CardTitle>
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

  const renderBillHistory = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          బిల్ చరిత్ర / Bill History
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="బిల్ నంబర్, కస్టమర్ లేదా ఫోన్ నంబర్ వెతకండి / Search bill number, customer or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-700">బిల్ నంబర్ / Bill No</th>
                <th className="text-left p-3 font-semibold text-gray-700">కస్టమర్ / Customer</th>
                <th className="text-left p-3 font-semibold text-gray-700">ఫోన్ / Phone</th>
                <th className="text-right p-3 font-semibold text-gray-700">మొత్తం / Total</th>
                <th className="text-center p-3 font-semibold text-gray-700">తేదీ / Date</th>
                <th className="text-center p-3 font-semibold text-gray-700">చర్యలు / Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.billNo} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 font-medium">{bill.billNo}</td>
                  <td className="p-3">{bill.customerName}</td>
                  <td className="p-3">{bill.phone}</td>
                  <td className="p-3 text-right font-semibold text-green-600">₹{bill.total.toFixed(2)}</td>
                  <td className="p-3 text-center">{bill.date}</td>
                  <td className="p-3 text-center">
                    <Button size="sm" variant="outline">
                      చూడండి / View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
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
      case 'bills':
        return renderBillHistory();
      default:
        return renderSalesReport();
    }
  };

  return (
    <>
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
            <CardTitle>ఎగుమతి ఎంపికలు / Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleDownload('PDF Report')}
              >
                <FileText size={16} />
                PDF గా ఎగుమతి చేయండి / Export as PDF
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleDownload('Excel Report')}
              >
                <FileSpreadsheet size={16} />
                Excel గా ఎగుమతి చేయండి / Export as Excel
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => window.print()}
              >
                <Download size={16} />
                నివేదికను ప్రింట్ చేయండి / Print Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PincodeModal
        isOpen={showPincodeModal}
        onClose={() => setShowPincodeModal(false)}
        onSuccess={handleDownloadSuccess}
        downloadType={downloadType}
      />
    </>
  );
};

export default ReportsScreen;
