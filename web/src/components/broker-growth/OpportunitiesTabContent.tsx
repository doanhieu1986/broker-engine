import { useState } from 'react';
import { mockCustomers } from '../../data/mockData';
import { useUser } from '../../context/UserContext';
import { RecommendationTabContent } from './RecommendationTabContent';

type OpportunitiesInternalTab = 'recommendation' | 'summary';

export function OpportunitiesTabContent() {
  const { role, user } = useUser();
  const [activeInternalTab, setActiveInternalTab] = useState<OpportunitiesInternalTab>('recommendation');

  const scoreForVCK = (c: any): number => {
    let score = 0;
    if (c.classification === 'VIP') score += 25;
    else if (c.classification === 'Affluent') score += 19;
    else if (c.classification === 'Mass Affluent') score += 10;
    else score += 3;
    if (c.navGroup.includes('>2B') || c.navGroup.includes('Nhóm A')) score += 21;
    else if (c.navGroup.includes('500M') || c.navGroup.includes('Nhóm B')) score += 13;
    else score += 5;
    if (c.activeStatus) score += 10;
    if (c.riskAppetite === 'Cao') score += 10;
    else if (c.riskAppetite === 'Cân bằng') score += 7;
    else score += 2;
    if (c.preferredProducts.includes('Chứng khoán')) score += 7;
    if (c.interestedIndustries.includes('Ngân hàng')) score += 6;
    if (c.marginStatus === 'Monitoring') score += 5;
    else if (c.marginStatus === 'Warning') score += 2;
    if (c.profit > 0) score += 2;
    return score;
  };

  const hasAlreadyBought = (c: any, score: number) => {
    const hash = parseInt(c.id.replace(/-/g, '').slice(-4), 16);
    if (score >= 70) return hash % 100 < 35;
    else if (score >= 40) return hash % 100 < 15;
    else return hash % 100 < 60;
  };

  const vckAnalysisCustomers = role === 'Manager' ? mockCustomers : mockCustomers.filter(c => c.brokerCode === user.brokerCode);

  const brokerVCKMap: Record<string, { high: number; medium: number; low: number; bought: number }> = {};
  vckAnalysisCustomers.forEach(c => {
    const score = scoreForVCK(c);
    const bought = hasAlreadyBought(c, score);
    if (!brokerVCKMap[c.brokerName]) {
      brokerVCKMap[c.brokerName] = { high: 0, medium: 0, low: 0, bought: 0 };
    }
    if (score >= 70) brokerVCKMap[c.brokerName].high++;
    else if (score >= 40) brokerVCKMap[c.brokerName].medium++;
    else brokerVCKMap[c.brokerName].low++;
    if (bought) brokerVCKMap[c.brokerName].bought++;
  });

  const brokerVCKList = Object.entries(brokerVCKMap)
    .map(([name, stats]) => {
      const total = stats.high + stats.medium + stats.low;
      return {
        name,
        ...stats,
        total,
        conversionRate: total > 0 ? Math.round((stats.bought / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.high - a.high);

  let totalHigh = 0, totalMedium = 0, totalLow = 0;
  let boughtHigh = 0, boughtMedium = 0, boughtLow = 0;
  vckAnalysisCustomers.forEach(c => {
    const score = scoreForVCK(c);
    const bought = hasAlreadyBought(c, score);
    if (score >= 70) {
      totalHigh++;
      if (bought) boughtHigh++;
    } else if (score >= 40) {
      totalMedium++;
      if (bought) boughtMedium++;
    } else {
      totalLow++;
      if (bought) boughtLow++;
    }
  });

  const brokerVCKStats = (() => {
    let high = 0, medium = 0, low = 0, bought = 0;
    vckAnalysisCustomers.forEach(c => {
      const score = scoreForVCK(c);
      const isBought = hasAlreadyBought(c, score);
      if (score >= 70) high++;
      else if (score >= 40) medium++;
      else low++;
      if (isBought) bought++;
    });
    const total = high + medium + low;
    return { high, medium, low, bought, total, conversionRate: total > 0 ? Math.round((bought / total) * 100) : 0 };
  })();

  return (
    <div className="space-y-6">
      {/* Internal Tabs Navigation */}
      <div className="flex gap-0 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <button
          onClick={() => setActiveInternalTab('recommendation')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${
            activeInternalTab === 'recommendation'
              ? 'border-b-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-b-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          Khuyến nghị
        </button>
        <button
          onClick={() => setActiveInternalTab('summary')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${
            activeInternalTab === 'summary'
              ? 'border-b-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-b-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
          }`}
        >
          Tổng hợp
        </button>
      </div>

      {/* Recommendation Tab */}
      {activeInternalTab === 'recommendation' && (
        <RecommendationTabContent />
      )}

      {/* Summary Tab */}
      {activeInternalTab === 'summary' && (
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Báo cáo tiềm năng mua VCK
          </h2>

        {role === 'Manager' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase mb-2">
                  🟢 Cao
                </p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totalHigh} <span className="text-sm text-emerald-600 dark:text-emerald-400">({(totalHigh + totalMedium + totalLow) > 0 ? Math.round((totalHigh / (totalHigh + totalMedium + totalLow)) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Đã mua: {boughtHigh} ({totalHigh > 0 ? Math.round((boughtHigh / totalHigh) * 100) : 0}%)</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase mb-2">
                  🟡 Trung bình
                </p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {totalMedium} <span className="text-sm text-amber-600 dark:text-amber-400">({(totalHigh + totalMedium + totalLow) > 0 ? Math.round((totalMedium / (totalHigh + totalMedium + totalLow)) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Đã mua: {boughtMedium} ({totalMedium > 0 ? Math.round((boughtMedium / totalMedium) * 100) : 0}%)</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">
                  ⬜ Thấp
                </p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                  {totalLow} <span className="text-sm text-gray-600 dark:text-gray-400">({(totalHigh + totalMedium + totalLow) > 0 ? Math.round((totalLow / (totalHigh + totalMedium + totalLow)) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Đã mua: {boughtLow} ({totalLow > 0 ? Math.round((boughtLow / totalLow) * 100) : 0}%)</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase mb-2">
                  ✅ Đã mua
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {boughtHigh + boughtMedium + boughtLow} <span className="text-sm text-blue-600 dark:text-blue-400">({(totalHigh + totalMedium + totalLow) > 0 ? Math.round(((boughtHigh + boughtMedium + boughtLow) / (totalHigh + totalMedium + totalLow)) * 100) : 0}%)</span>
                </p>
              </div>
            </div>

            {(totalHigh + totalMedium + totalLow) > 0 && (
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiến độ chuyển đổi VCK
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {boughtHigh + boughtMedium + boughtLow} / {totalHigh + totalMedium + totalLow} KH ({Math.round(((boughtHigh + boughtMedium + boughtLow) / (totalHigh + totalMedium + totalLow)) * 100)}%)
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.round(((boughtHigh + boughtMedium + boughtLow) / (totalHigh + totalMedium + totalLow)) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {role === 'Manager' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                So sánh tiến độ chuyển đổi VCK theo Broker
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  {[...brokerVCKList].sort((a, b) => b.conversionRate - a.conversionRate).map(broker => {
                    const rate = broker.conversionRate;
                    const barColor = rate > 50 ? 'bg-emerald-500' : rate > 30 ? 'bg-blue-500' : rate > 15 ? 'bg-amber-500' : 'bg-red-500';
                    return (
                      <div key={broker.name} className="flex items-center gap-3">
                        <span className="text-sm text-gray-700 dark:text-gray-300 text-right shrink-0 w-28 truncate">{broker.name}</span>
                        <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-7 overflow-hidden">
                          <div
                            className={`${barColor} h-full rounded-full flex items-center px-2 transition-all duration-500`}
                            style={{ width: `${Math.max(rate, 5)}%` }}
                          >
                            <span className="text-white text-xs font-semibold whitespace-nowrap">{rate}%</span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{broker.bought}/{broker.total}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {(
                    [
                      { label: 'Xuất sắc', threshold: '>50%',   check: (r: number) => r > 50,          bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', chip: 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300' },
                      { label: 'Tốt',       threshold: '30–50%', check: (r: number) => r > 30 && r <= 50, bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',         text: 'text-blue-700 dark:text-blue-300',     chip: 'bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300' },
                      { label: 'Khá',       threshold: '15–30%', check: (r: number) => r > 15 && r <= 30, bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',       text: 'text-amber-700 dark:text-amber-300',   chip: 'bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300' },
                      { label: 'Cần cải thiện', threshold: '≤15%', check: (r: number) => r <= 15,          bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',             text: 'text-red-700 dark:text-red-300',       chip: 'bg-red-100 dark:bg-red-800/40 text-red-700 dark:text-red-300' },
                    ] as const
                  ).map(cat => {
                    const matched = brokerVCKList.filter(b => cat.check(b.conversionRate));
                    return (
                      <div key={cat.label} className={`${cat.bg} rounded-lg p-3 border`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${cat.text}`}>{cat.label} ({cat.threshold})</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cat.chip}`}>{matched.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {matched.map(b => (
                            <span key={b.name} className={`text-xs px-2 py-0.5 rounded ${cat.chip}`}>{b.name}</span>
                          ))}
                          {matched.length === 0 && <span className="text-xs text-gray-400 italic">Không có</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            )}

            <div className="overflow-x-auto">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Phân tích chi tiết theo Broker</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Broker</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">🟢 Cao (≥70)</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">🟡 TB (40-69)</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">⬜ Thấp (&lt;40)</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Tổng tiềm năng</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">✅ Đã mua</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Tỷ lệ</th>
                    <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {brokerVCKList.map(broker => (
                    <tr key={broker.name} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{broker.name}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded font-semibold">
                          {broker.high}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded font-semibold">
                          {broker.medium}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-semibold">
                          {broker.low}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white">
                        {broker.total}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-blue-600 dark:text-blue-400">
                        {broker.bought}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                              style={{ width: `${broker.conversionRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-900 dark:text-white whitespace-nowrap w-10 text-right">
                            {broker.conversionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {(() => {
                          const rate = broker.conversionRate;
                          if (rate > 50) {
                            return <span className="inline-block px-2 py-1 bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300 rounded text-xs font-semibold">Xuất sắc</span>;
                          } else if (rate > 30) {
                            return <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300 rounded text-xs font-semibold">Tốt</span>;
                          } else if (rate > 15) {
                            return <span className="inline-block px-2 py-1 bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300 rounded text-xs font-semibold">Khá</span>;
                          } else {
                            return <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-800/40 text-red-700 dark:text-red-300 rounded text-xs font-semibold">Cần cải thiện</span>;
                          }
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {brokerVCKList.length === 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Không có dữ liệu khách hàng tiềm năng.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase mb-2">
                  🟢 Cao
                </p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {brokerVCKStats.high} <span className="text-sm text-emerald-600 dark:text-emerald-400">({brokerVCKStats.total > 0 ? Math.round((brokerVCKStats.high / brokerVCKStats.total) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Đã mua: 0 (0%)</p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase mb-2">
                  🟡 Trung bình
                </p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {brokerVCKStats.medium} <span className="text-sm text-amber-600 dark:text-amber-400">({brokerVCKStats.total > 0 ? Math.round((brokerVCKStats.medium / brokerVCKStats.total) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">Đã mua: 0 (0%)</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">
                  ⬜ Thấp
                </p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                  {brokerVCKStats.low} <span className="text-sm text-gray-600 dark:text-gray-400">({brokerVCKStats.total > 0 ? Math.round((brokerVCKStats.low / brokerVCKStats.total) * 100) : 0}%)</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Đã mua: 0 (0%)</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase mb-2">
                  ✅ Đã mua
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {brokerVCKStats.bought} <span className="text-sm text-blue-600 dark:text-blue-400">({brokerVCKStats.conversionRate}%)</span>
                </p>
              </div>
            </div>

            {brokerVCKStats.total > 0 && (
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Tiến độ chuyển đổi VCK
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {brokerVCKStats.bought} / {brokerVCKStats.total} KH ({brokerVCKStats.conversionRate}%)
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${brokerVCKStats.conversionRate}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
      )}
    </div>
  );
}
