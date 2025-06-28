// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
// import { useSalesChart } from "@/store/useSalesChart"
// import { useEffect } from "react"
// import { Loader2, RefreshCw, AlertTriangle } from "lucide-react"

// const chartConfig = {
//   revenue: {
//     label: "Revenue",
//     color: "hsl(142, 76%, 36%)",
//   },
//   expenses: {
//     label: "Expenses",
//     color: "hsl(0, 84%, 60%)",
//   },
// }

// export function SalesChart() {
//   const { salesData, isLoading, error, fetchSalesChartData } = useSalesChart()

//   useEffect(() => {
//     fetchSalesChartData()
//   }, [fetchSalesChartData])

//   // Calculate totals for the year (removed profit calculation)
//   const totals = salesData.reduce(
//     (acc, month) => ({
//       revenue: acc.revenue + month.revenue,
//       expenses: acc.expenses + month.expenses,
//       salesCount: acc.salesCount + month.salesCount
//     }),
//     { revenue: 0, expenses: 0, salesCount: 0 }
//   )

//   // Get current year for display
//   const currentYear = new Date().getFullYear()

//   return (
//     <Card className="border-slate-200/50 bg-white/60 backdrop-blur-sm shadow-sm">
//       <CardHeader className="pb-4">
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="text-xl font-bold text-slate-900">
//               Revenue vs Expenses Overview
//             </CardTitle>
//             <CardDescription className="text-slate-600 font-medium">
//               Monthly revenue and total inventory expenses for {currentYear}
//               {totals.salesCount > 0 && (
//                 <span className="block text-sm mt-1">
//                   Total: ${totals.revenue.toLocaleString()} revenue • ${totals.expenses.toLocaleString()} inventory cost • {totals.salesCount} sales
//                 </span>
//               )}
//             </CardDescription>
//           </div>
//           <button
//             onClick={fetchSalesChartData}
//             disabled={isLoading}
//             className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
//           >
//             <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
//             <span>Refresh</span>
//           </button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="h-[350px] flex items-center justify-center">
//             <div className="flex items-center space-x-2 text-slate-600">
//               <Loader2 className="h-6 w-6 animate-spin" />
//               <span>Loading chart data...</span>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="h-[350px] flex items-center justify-center">
//             <div className="flex items-center space-x-2 text-red-600">
//               <AlertTriangle className="h-6 w-6" />
//               <span>Error loading chart: {error}</span>
//             </div>
//           </div>
//         ) : salesData.length === 0 ? (
//           <div className="h-[350px] flex items-center justify-center">
//             <div className="text-center text-slate-600">
//               <div className="text-lg font-medium mb-2">No sales data available</div>
//               <div className="text-sm">Sales data will appear here once you start making sales</div>
//             </div>
//           </div>
//         ) : (
//           <ChartContainer config={chartConfig}>
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={salesData} barGap={8}>
//                 <XAxis 
//                   dataKey="date" 
//                   stroke="#64748b" 
//                   fontSize={12} 
//                   tickLine={false} 
//                   axisLine={false}
//                   tick={{ fill: '#64748b', fontWeight: 500 }}
//                 />
//                 <YAxis
//                   stroke="#64748b"
//                   fontSize={12}
//                   tickLine={false}
//                   axisLine={false}
//                   tick={{ fill: '#64748b', fontWeight: 500 }}
//                   tickFormatter={(value) => `$${value}`}
//                 />
//                 <ChartTooltip
//                   cursor={{ fill: 'rgba(148, 163, 184, 0.1)', radius: 4 }}
//                   content={({ active, payload, label }) => {
//                     if (active && payload && payload.length) {
//                       const data = salesData.find(d => d.date === label)
//                       return (
//                         <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm p-4 shadow-lg">
//                           <div className="mb-2">
//                             <span className="text-sm font-semibold text-slate-900">{label} {currentYear}</span>
//                             {data && (
//                               <div className="text-xs text-slate-500 mt-1">
//                                 {data.salesCount} sale{data.salesCount !== 1 ? 's' : ''} • {data.fullDate}
//                               </div>
//                             )}
//                           </div>
//                           <div className="grid gap-2">
//                             {payload.map((entry, index) => (
//                               <div key={index} className="flex items-center gap-3">
//                                 <div 
//                                   className="h-3 w-3 rounded-full shadow-sm" 
//                                   style={{ backgroundColor: entry.color }} 
//                                 />
//                                 <span className="text-sm font-medium text-slate-700">
//                                   {entry.dataKey === "revenue" ? "Revenue" : "Inventory Cost"}: 
//                                   <span className="font-bold ml-1">${entry.value?.toLocaleString()}</span>
//                                 </span>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )
//                     }
//                     return null
//                   }}
//                 />
//                 <Bar 
//                   dataKey="revenue" 
//                   fill="hsl(142, 76%, 36%)" 
//                   radius={[6, 6, 0, 0]}
//                   className="drop-shadow-sm"
//                 />
//                 <Bar 
//                   dataKey="expenses" 
//                   fill="hsl(0, 84%, 60%)" 
//                   radius={[6, 6, 0, 0]}
//                   className="drop-shadow-sm"
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartContainer>
//         )}
//       </CardContent>
//     </Card>
//   )
// }