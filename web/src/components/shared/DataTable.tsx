import { useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronUp, ChevronDown, Download } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchFields?: string[];
  onExport?: () => void;
  title?: string;
  onRowClick?: (row: any) => void;
  compact?: boolean;
  filters?: ReactNode;
}

export function DataTable({
  columns,
  data,
  searchFields = [],
  onExport,
  title,
  onRowClick,
  compact = false,
  filters,
}: DataTableProps) {
  const [sortKey, setSortKey] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Filter data
  let filteredData = data;
  if (searchTerm && searchFields.length > 0) {
    filteredData = data.filter((row) =>
      searchFields.some(
        (field) =>
          String(row[field]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  // Sort data
  if (sortKey) {
    filteredData = [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h3>
        <div className="flex gap-3 items-end flex-wrap">
          {filters && (
            <div className="flex gap-3">
              {filters}
            </div>
          )}
          {searchFields.length > 0 && (
            <input
              type="text"
              placeholder="Tìm kiếm KH..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg border border-primary-300 dark:border-primary-700/50 transition-colors"
            >
              <Download size={16} />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`text-left text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${
                    compact ? 'px-3 py-2' : 'px-6 py-4'
                  } ${column.width ? column.width : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && sortKey === column.key && (
                      sortOrder === 'asc' ? (
                        <ChevronUp size={16} className="text-primary-600 dark:text-primary-400" />
                      ) : (
                        <ChevronDown size={16} className="text-primary-600 dark:text-primary-400" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                >
                  <p className="text-sm">Không có dữ liệu</p>
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-100 dark:border-slate-800 hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-colors ${
                    onRowClick ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`${compact ? 'px-3 py-2 text-xs' : 'px-6 py-4 text-sm'} text-slate-700 dark:text-slate-300 whitespace-nowrap`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 text-sm font-medium text-slate-600 dark:text-slate-400">
        Hiển thị <span className="text-slate-900 dark:text-white font-bold">{filteredData.length}</span> / <span className="text-slate-900 dark:text-white font-bold">{data.length}</span> bản ghi
      </div>
    </div>
  );
}
