import React, { useState } from 'react';
import { Calculator, PieChart } from 'lucide-react';

const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState(7500000); // ₹75 Lakhs default
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5); // ~8.5% Indian home loan rate
  const [loanTermYears, setLoanTermYears] = useState(20);

  // Calculations
  const downPaymentAmount = (homePrice * downPaymentPercent) / 100;
  const principalLoanAmount = homePrice - downPaymentAmount;

  const monthlyInterestRate = interestRate / 100 / 12;
  const totalMonths = loanTermYears * 12;

  let monthlyEMI = 0;
  if (monthlyInterestRate > 0) {
    monthlyEMI =
      (principalLoanAmount *
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths))) /
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
  } else {
    monthlyEMI = principalLoanAmount / totalMonths;
  }

  const estimatedTax = (homePrice * 0.008) / 12; // ~0.8% property tax estimate
  const estimatedInsurance = (homePrice * 0.003) / 12;
  const totalMonthlyPayment = Math.round(monthlyEMI + estimatedTax + estimatedInsurance);

  const formatRupees = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lakhs`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 font-extrabold text-xs uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Indian Home Loan Calculator</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            EMI & Monthly Housing Payment Estimator
          </h3>
        </div>

        <div className="bg-brand-50 border border-brand-200 px-5 py-3 rounded-2xl text-center">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Estimated Monthly EMI</span>
          <p className="text-2xl font-extrabold text-brand-600">
            ₹{totalMonthlyPayment.toLocaleString('en-IN')}<span className="text-xs font-semibold text-slate-500">/mo</span>
          </p>
        </div>
      </div>

      {/* Sliders & Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          {/* Home Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 uppercase">Property Price</span>
              <span className="text-slate-900 text-sm font-extrabold">{formatRupees(homePrice)}</span>
            </div>
            <input
              type="range"
              min="1500000"
              max="50000000"
              step="500000"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          {/* Down Payment % */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 uppercase">Down Payment ({downPaymentPercent}%)</span>
              <span className="text-slate-900 text-sm font-extrabold">{formatRupees(downPaymentAmount)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          {/* Interest Rate & Term */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Home Loan Rate (% p.a.)</label>
              <input
                type="number"
                step="0.1"
                min="5"
                max="15"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Loan Tenure (Years)</label>
              <select
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold bg-white focus:outline-none focus:border-brand-500"
              >
                <option value={10}>10 Years</option>
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={25}>25 Years</option>
                <option value={30}>30 Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Breakdown Card */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4 flex flex-col justify-between">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-brand-600" />
            <span>Monthly Payment Breakdown</span>
          </h4>

          <div className="space-y-3 text-xs font-medium">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="flex items-center space-x-2 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-brand-600 inline-block" />
                <span>Monthly Bank EMI</span>
              </span>
              <span className="font-bold text-slate-900">₹{Math.round(monthlyEMI).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="flex items-center space-x-2 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span>Property Tax / Muncipal Charges</span>
              </span>
              <span className="font-bold text-slate-900">₹{Math.round(estimatedTax).toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="flex items-center space-x-2 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span>Property Insurance (Est.)</span>
              </span>
              <span className="font-bold text-slate-900">₹{Math.round(estimatedInsurance).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400">
            *Estimates based on typical Indian bank interest rates (SBI, HDFC, ICICI).
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;
