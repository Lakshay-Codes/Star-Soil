import { useState, useEffect } from "react";
import PageTitle from "../../../../components/page-title"
import { App, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import userStore from "../../../../store/users-store";
import { format } from "indian-number-format";

function UserReportsPage() {
  const { currentUser } = userStore() as { currentUser: { _id: string } };
  const [reports, setReports] = useState({
    totalAmount: 0,
    totalPayments: 0,
    lastFivePayments: [],
  });

  const PRICE_PER_ACRE = 5000;
  const totalLandInAcres = reports.totalAmount / PRICE_PER_ACRE;

  const getData = async () => {
    try {
      const response = await axios.get(`/api/reports/user-reports/${currentUser._id}`);
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
        <PageTitle title="My Space Portfolio" />

        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-indigo-800 mb-6">Recent Space Transactions</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-indigo-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Planet Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Land (Acres)</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-indigo-700">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {reports.lastFivePayments?.map((payment: any) => (
                  <tr key={payment._id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-indigo-600">{payment.planet?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-600">₹{format(payment.amount)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-600">{(payment.amount / PRICE_PER_ACRE).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-indigo-500">{dayjs(payment.createdAt).format('MMMM DD, YYYY hh:mm A')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-blue-100 hover:shadow-xl transition-all">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Total Transactions</h2>
            <p className="text-4xl font-bold text-blue-600">{reports.totalPayments}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-violet-100 hover:shadow-xl transition-all">
            <h2 className="text-xl font-semibold text-violet-900 mb-3">Total Investment</h2>
            <div className="flex flex-col">
              <p className="text-4xl font-bold text-violet-600">₹{format(reports.totalAmount)}</p>
              <p className="text-sm text-violet-500 mt-2">Land Owned: {totalLandInAcres.toFixed(2)} acres</p>
              <p className="text-xs text-violet-400">@₹{format(PRICE_PER_ACRE)}/acre</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-purple-100 hover:shadow-xl transition-all">
            <h2 className="text-xl font-semibold text-purple-900 mb-3">Portfolio Status</h2>
            <p className="text-4xl font-bold text-purple-600">Active</p>
          </div>
        </div>
      </div>
    </App>
  );
}

export default UserReportsPage;