import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabase';

function AnalyticsReport() {
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect (() =>{
        fetchAnalyticsData();
    },[selectedYear]);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            setError(null)

            const {data: order, error:ordersError} = await supabase .from('order_tbl')
            .select('*')
            .gte('order_date',`${selectedYear}-01-01`)
            .lt('order_date',`${selectedYear + 1}-01-01`)
            .order('order_date',{ascending:true});

            if(ordersError){
                throw error
            }

            const monthly = processMonthlyData(order);
            setMonthlyData(monthly);
        }catch(error){
            console.error('Error fetching analytics:',error);
            setError(error.message);
        }finally{
            setLoading(false);
        }
        
    };

        const processMonthlyData = (orders) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthlyStats = months.map((month, index) => {
            const monthOrders = orders.filter(order => {
                const orderDate = new Date(order.order_date);
                return orderDate.getMonth() === index;
            });

            const totalRevenue = monthOrders.reduce((sum, order) => {
                return sum + parseFloat(order.total_amount || 0);
            }, 0);

            const completedOrders = monthOrders.filter(order => order.status === 'completed').length;
            const pendingOrders = monthOrders.filter(order => order.status === 'pending').length;

            return {
                month: month,
                totalOrders: monthOrders.length,
                revenue: totalRevenue,
                completed: completedOrders,
                pending: pendingOrders
            };
        });

        return monthlyStats;
    };


    if (loading) {
        return (
             <div className='col-span-3 mx-auto mt-72'>
                <div className="w-16 h-16 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
           <div className='col-span-3 mx-auto mt-72'>
                <div className="max-w-md px-4 py-3 text-red-700 bg-red-100 border border-red-700 rounded">
                    <p className="text-center text-md">Error loading analytics</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={fetchAnalyticsData}
                        className="px-4 py-2 mt-3 text-white bg-red-400 rounded-lg hover:bg-red-500"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    
  return (
     <div className="h-full col-span-2 p-5 bg-white">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-2xl font-bold text-gray-800">Monthly Analytics Report</h1>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                     className="flex px-5 py-2 border rounded appearance-none cursor-pointer"
                >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                </select>
            </div>
             <div className="bg-white rounded-lg shadow ">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Monthly Breakdown - {selectedYear}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Month</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Total Orders</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Revenue</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Completed</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500 uppercase">Pending</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {monthlyData.map((month, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {month.month}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {month.totalOrders}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        Rs {month.revenue.toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-green-600">
                                        {month.completed}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-orange-600">
                                        {month.pending}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
  </div>
    );
}


export default AnalyticsReport
