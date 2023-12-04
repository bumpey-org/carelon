import React from 'react';

const DownloadCSV = ({ data, startDate, endDate, location }) => {
  // Function to convert array to CSV
  const arrayToCSV = (arr) => {
    const csvRows = [];
    // Get headers
    const headers = Object.keys(arr[0]);
    csvRows.push(headers.join(','));

    // Loop over the rows
    for (const row of arr) {
      const values = headers.map((header) => {
        const cell = row[header];
        const formattedCell = typeof cell === 'number' ? cell.toFixed(2) : cell; // Round numbers to two decimal places
        const escaped = ('' + formattedCell).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };

  // Convert data to CSV
  const csvData = arrayToCSV(data);

  // Create Blob from CSV data
  const blob = new Blob([csvData], { type: 'text/csv' });

  // Generate download URL
  const url = URL.createObjectURL(blob);
  const fileName = `data_${location}_${startDate}_${endDate}.csv`;

  return (
    <a href={url} download={fileName} className="z-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6  text-emerald-900"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
    </a>
  );
};

export default DownloadCSV;
