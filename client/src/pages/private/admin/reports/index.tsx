import { useState, useEffect } from "react";
import PageTitle from "../../../../components/page-title"
import { App, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { format } from "indian-number-format";

function AdminReportsPage() {
  const [reports, setReports] = useState({
    totalUsers: 0,
    totalPlanets: 0,
    totalAmount: 0,
    totalPayments: 0,
    payments: [],
    recentFivePayments: [],
  });

  const PRICE_PER_ACRE = 5000;
  const totalLandInAcres = reports.totalAmount / PRICE_PER_ACRE;

  const getData = async () => {
    try {
      const response = await axios.get("/api/reports/admin-reports");
      setReports(response.data.data);
    } catch (error: any) {
      message.error(error.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <App>
      <div className="p-5">
        <PageTitle title="Galactic Dashboard" />
        
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6">Recent Space Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Planet ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">User ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Land (Acres)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {reports.recentFivePayments?.map((payment: any) => (
                  <tr key={payment._id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-indigo-600">{payment.planet || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-indigo-600">{payment.user || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-600">₹{format(Number(payment.amount.toFixed(2)))}</td>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-600">{(payment.amount / PRICE_PER_ACRE).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-indigo-500">{dayjs(payment.createdAt).format('MMMM DD, YYYY hh:mm A')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-indigo-100 hover:shadow-xl transition-all">
            <h2 className="text-xl font-semibold text-indigo-900 mb-3">Total Planets</h2>
            <p className="text-4xl font-bold text-indigo-600">{Number(reports.totalPlanets.toFixed(2))}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-blue-100 hover:shadow-xl transition-all">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Total Users</h2>
            <p className="text-4xl font-bold text-blue-600">{Number(reports.totalUsers.toFixed(2))}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-violet-100 hover:shadow-xl transition-all">
            <h2 className="text-xl font-semibold text-violet-900 mb-3">Total Revenue</h2>
            <div className="flex flex-col">
              <p className="text-4xl font-bold text-violet-600">₹{format(Number(reports.totalAmount.toFixed(2)))}</p>
              <p className="text-sm text-violet-500 mt-2">Land Sold: {totalLandInAcres.toFixed(2)} acres</p>
              <p className="text-xs text-violet-400">@₹{format(Number(PRICE_PER_ACRE.toFixed(2)))}/acre</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-purple-100 hover:shadow-xl transition-all">
            <h2 className="text-xl font-semibold text-purple-900 mb-3">Total Transactions</h2>
            <p className="text-4xl font-bold text-purple-600">{Number(reports.totalPayments.toFixed(2))}</p>
          </div>
        </div>
      </div>
    </App>
  );
}

export default AdminReportsPage;