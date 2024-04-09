
"use client"
import React, { useState, useEffect } from 'react';
import { UserButton } from "@clerk/nextjs";
import { Datepicker } from 'flowbite-react';
import Orders from '../components/Orders';
import Link from 'next/link';

export default function Home() {

    const [startDate, setStartDate] = useState(formatDate(new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000))));
    const [endDate, setEndDate] = useState(formatDate(new Date()));

    const [ordersKey, setOrdersKey] = useState(0);

    const handleSearchClick = () => {
        setOrdersKey(prevKey => prevKey + 1); // Increment the key to trigger a re-render
    };

    // Function to format dates to "Month day, year"
    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }

    // Handle date change
    const handleStartDateChange = (date) => {
        setStartDate(formatDate(date));
    };
    const handleEndDateChange = (date) => {
        setEndDate(formatDate(date));
    };



    return (<div className='w-full h-full min-h-full overflow-y-auto  mx-auto px- '>
        <div className=" p-4 bg-white border min-h-screen border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="items-center justify-between pb-4 border-b border-gray-200 sm:flex dark:border-gray-700">
                <div className="w-full mb-4 sm:mb-0">
                    <div className="flex gap-4">
                        <div className="">
                            <Link href='/'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-900">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                            </Link>
                        </div>
                        <UserButton afterSignOutUrl="/" />


                    </div>
                    <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">Sales</h3>
                    <span className="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">Raasta</span>

                </div>
                <div className="w-full max-w-lg">
                    <div className="flex items-center justify-around gap-4">
                        <div className="w-full">

                            <Datepicker icon={false} value={startDate} maxDate={new Date()} onSelectedDateChanged={handleStartDateChange}></Datepicker>
                        </div>


                        <div className="w-full">

                            <Datepicker icon={false} value={endDate} maxDate={new Date()} onSelectedDateChanged={handleEndDateChange}></Datepicker>
                        </div>
                        <div className="flex justify-end">

                            <button onClick={handleSearchClick} className="flex items-center justify-center  px-4 py-2 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-blue-500 hover:bg-blue-700 focus:shadow-outline focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>


                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between  ">
                <Orders key={ordersKey} location='raasta' startDate={startDate} endDate={endDate}></Orders>
            </div>
        </div>


    </div>
    );
}
