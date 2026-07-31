import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calculator, ArrowUpRight, BarChart3, PieChart } from 'lucide-react';

const PropertyInvestmentCalculator = () => {
  const [initialPriceLakhs, setInitialPriceLakhs] = useState(65); // Initial price in Lakhs
  const [holdingYears, setHoldingYears] = useState(5);
  const [expectedAppreciation, setExpectedAppreciation] = useState(8.5); // % per annum
  const [monthlyRentalIncome, setMonthlyRentalIncome] = useState(25000); // INR per month

  // Calculations
  const initialPriceINR = initialPriceLakhs * 100000;
  const futureValueINR = initialPriceINR * Math.pow(1 + expectedAppreciation / 100, holdingYears);
  const totalCapitalGainINR = futureValueINR - initialPriceINR;
  const totalRentalIncomeINR = monthlyRentalIncome * 12 * holdingYears;
  const totalReturnINR = totalCapitalGainINR + totalRentalIncomeINR;
  const totalROI = ((totalReturnINR / initialPriceINR) * 100).toFixed(1);

  // Formatting helpers
  const formatLakhsCr = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Guwahati Property ROI Estimator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assam Real Estate Appreciation & ROI Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Project 5-year to 10-year capital gains and rental returns on GS Road, Beltola, and Guwahati properties.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-100 flex items-center space-x-3">
          <Calculator className="w-6 h-6 text-brand-600" />
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Estimated Total Return</div>
            <div className="text-lg font-extrabold text-brand-700">{formatLakhsCr(totalReturnINR)}</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Inputs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Property Purchase Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-700 uppercase">Initial Property Price</label>
              <span className="text-brand-600 font-extrabold text-sm">₹{initialPriceLakhs} Lakhs</span>
            </div>
            <input
              type="range"
              min="20"
              max="300"
              step="5"
              value={initialPriceLakhs}
              onChange={(e) => setInitialPriceLakhs(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>₹20 Lakhs</span>
              <span>₹1.5 Crore</span>
              <span>₹3 Crore</span>
            </div>
          </div>

          {/* Holding Duration */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-700 uppercase">Investment Horizon (Years)</label>
              <span className="text-brand-600 font-extrabold text-sm">{holdingYears} Years</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={holdingYears}
              onChange={(e) => setHoldingYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>1 Year</span>
              <span>5 Years</span>
              <span>15 Years</span>
            </div>
          </div>

          {/* Expected Annual Appreciation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-700 uppercase">Expected Annual Growth (% p.a.)</label>
              <span className="text-emerald-600 font-extrabold text-sm">{expectedAppreciation}% p.a.</span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="0.5"
              value={expectedAppreciation}
              onChange={(e) => setExpectedAppreciation(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>3% (Conservative)</span>
              <span>8.5% (Guwahati Avg)</span>
              <span>15% (High Growth)</span>
            </div>
          </div>

          {/* Expected Monthly Rent */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-700 uppercase">Estimated Monthly Rent (₹)</label>
              <span className="text-indigo-600 font-extrabold text-sm">₹{monthlyRentalIncome.toLocaleString('en-IN')}/mo</span>
            </div>
            <input
              type="range"
              min="5000"
              max="150000"
              step="2500"
              value={monthlyRentalIncome}
              onChange={(e) => setMonthlyRentalIncome(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* Right Output Display Card */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-navy-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white space-y-6 shadow-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-brand-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Projected Returns</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-500/30">
              +{totalROI}% Total ROI
            </div>
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[11px] font-semibold text-slate-400">Future Property Value</div>
              <div className="text-xl font-extrabold text-white">{formatLakhsCr(futureValueINR)}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[11px] font-semibold text-slate-400">Capital Appreciation</div>
              <div className="text-xl font-extrabold text-emerald-400">+{formatLakhsCr(totalCapitalGainINR)}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[11px] font-semibold text-slate-400">Total Rental Income</div>
              <div className="text-xl font-extrabold text-indigo-300">+{formatLakhsCr(totalRentalIncomeINR)}</div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="text-[11px] font-semibold text-slate-400">Annualized Return</div>
              <div className="text-xl font-extrabold text-amber-300">
                {(expectedAppreciation + ((monthlyRentalIncome * 12) / initialPriceINR) * 100).toFixed(1)}% p.a.
              </div>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-slate-300">
              <span>Return Breakdown</span>
              <span>Capital Gain vs Rent</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(totalCapitalGainINR / totalReturnINR) * 100}%` }}
                className="h-full bg-emerald-500 transition-all duration-500"
              />
              <div
                style={{ width: `${(totalRentalIncomeINR / totalReturnINR) * 100}%` }}
                className="h-full bg-indigo-500 transition-all duration-500"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span>Capital Growth ({( (totalCapitalGainINR / totalReturnINR) * 100 ).toFixed(0)}%)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                <span>Rental Yield ({( (totalRentalIncomeINR / totalReturnINR) * 100 ).toFixed(0)}%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInvestmentCalculator;
