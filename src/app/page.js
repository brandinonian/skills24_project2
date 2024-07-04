'use client'

import { useEffect, useState } from "react";

export default function Home() {

  const [data, setData] = useState();

  async function FetchPayrollData() {
    const response = await fetch('api/payroll');
    const message = await response.json();
    let result = message.csvData.map(line => { return line });
    if (result) {
      setData([...result]);
    }
  }

  useEffect(() => {
    FetchPayrollData();
  }, []);

  function parseWageCode(code) {
    switch (parseInt(code)) {
      case 1:
        return 15;
      case 2:
        return 17.5;
      case 3:
        return 20;
      case 4:
        return 22.25;
      case 5:
        return 25;
      default:
        return 0;
    }
  }

  function calculateTotalPay(hours, wageCode) {
    const basePay = parseWageCode(wageCode);
    if (hours > 40) {
      return (((hours - 40) * basePay * 1.5) + (40 * basePay)) * 0.9 - 12;
    }
    else {
      return (hours * basePay) * 0.9 - 12;
    }
  }

  function calculateRegularPay(hours, wageCode) {
    const basePay = parseWageCode(wageCode);
    if (hours > 40) {
      return 40 * basePay;
    }
    else {
      return hours * basePay;
    }
  }

  function calculateOverTimeHours(hours) {
    if (hours > 40) {
      return hours - 40;
    }
    else {
      return 0;
    }
  }

  function calculateOverTimePay(hours, wageCode) {
    const basePay = parseWageCode(wageCode);
    if (hours > 40) {
      return (hours - 40) * (basePay * 1.5);
    }
    else {
      return 0;
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-700 text-gray-200 p-8">
      <div className="flex flex-col gap-4 pb-12">
        <h1 className="text-7xl">Payroll Program</h1>
      </div>
      {data && (
        <div className="grid grid-cols-3 gap-8">
          {data.map(item => (
            <div key={item[2]} className="col-span-1 bg-slate-900 p-8 rounded-sm">
              <p>{item[0]} {item[1]}</p>
              <p>SS#: {item[2]}</p>
              <div className="divider" />
              <p>Wage: ${parseWageCode(item[3]).toFixed(2)}</p>
              <p>Reg Hours: {item[4]}</p>
              <p>Reg Pay: ${calculateRegularPay(item[4], item[3]).toFixed(2)}</p>
              <p>OT Hours: {calculateOverTimeHours(item[4])}</p>
              <p>OT Pay: ${calculateOverTimePay(item[4], item[3]).toFixed(2)}</p>
              <p>Taxes: ${(parseWageCode(item[3]) * item[4] * .1).toFixed(2)}</p>
              <p>Insurance: $12.00</p>
              <div className="divider" />
              <p>Total Pay: ${calculateTotalPay(item[4], item[3]).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
