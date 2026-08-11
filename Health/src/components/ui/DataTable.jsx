import React from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';
import { ArrowUpDown } from 'lucide-react';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available.',
  onSort,
  sortKey,
  sortOrder,
}) => {
  if (loading) {
    return <LoadingSkeleton variant="table" count={5} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title="No Records Found" description={emptyMessage} />;
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-xs">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
            {columns.map((col) => (
              <th
                key={col.key || col.label}
                className="px-6 py-3.5 select-none"
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center space-x-1.5 cursor-pointer">
                  <span>{col.label}</span>
                  {col.sortable && <ArrowUpDown className="h-3 w-3 text-slate-400" />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className="hover:bg-slate-50/70 transition-colors duration-150">
              {columns.map((col) => (
                <td key={col.key || col.label} className="px-6 py-4 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
