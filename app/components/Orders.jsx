'use client';
import React, { useState, useEffect } from 'react';
import {
  getCustomers,
  getOrders,
  calculateCustomerTotals,
} from '@/utils/wooCommerce';
import DownloadCSV from './DownloadCSV';

export default function Orders({ startDate, endDate, location }) {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders({
          after: startDate,
          before: endDate,
          location,
        });
        const fetchedCustomers = await getCustomers({ location });

        setOrders(fetchedOrders);
        const data = calculateCustomerTotals(fetchedCustomers, fetchedOrders);
        setCustomers(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading)
    return (
      <div className="text-center p-4 text-black">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-danger motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 p-4">
        Error loading orders: {error.message}
      </div>
    );

  return (
    <div className="w-full mx-auto text-white">
      {customers.length > 0 ? (
        <div className="overflow-x-auto  shadow-md sm:rounded-lg">
          <div className="my-4 flex gap-4 w-full justify-end text-sm">
            <div className="text-gray-500">
              {startDate} -&gt;` {endDate}
            </div>
            <DownloadCSV
              data={customers}
              startDate={startDate}
              endDate={endDate}
              location={location}
            ></DownloadCSV>
          </div>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Name
                </th>
                <th scope="col" className="py-3 px-6">
                  Orders
                </th>
                <th scope="col" className="py-3 px-6">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {customers
                .sort((a, b) => b.totalValue - a.totalValue)
                .map((customer, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="py-4 px-6">
                      {customer.lastName}, {customer.firstName}
                    </td>
                    <td className="py-4 px-6">{customer.totalOrders}</td>
                    <td className="py-4 px-6">
                      €{customer.totalValue.toFixed(2)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No customer data available.</div>
      )}
    </div>
  );
}
