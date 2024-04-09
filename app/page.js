"use client"
import React, { useState, useEffect } from 'react';


import { Button } from 'flowbite-react';
import Orders from './components/Orders';
import { UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {

  const [startDate, setStartDate] = useState(formatDate(new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000))));
  const [endDate, setEndDate] = useState(formatDate(new Date()));

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



  return (<div className='max-w-4xl h-full min-h-screen overflow-y-auto flex flex-col gap-y-10 my-4  mx-auto px-12'>
    <div className="flex gap-3">
      <UserButton afterSignOutUrl="/" />
      <Image src='/carelon.svg'
        alt='Carelon Logo'
        width={120}
        height={150}

      ></Image>
    </div>
    <div className="flex w-full gap-8">
      <Link href="/delish">
        <Button className="bg-emerald-900">Delish</Button>
      </Link>
      <Link href="/factory">
        <Button className="bg-emerald-900">Factory</Button>
      </Link>
      <Link href="/raasta">
        <Button className="bg-emerald-900">Raasta</Button>
      </Link>
    </div>
  </div>
  );
}

