import { PenLine } from 'lucide-react';

export default function DocumentShowFloatingActions() {
    return (
        <div className="fixed bottom-6 left-6 flex gap-1 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md overflow-hidden z-10">
            <button className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 text-xs font-bold uppercase rounded-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">PDF</button>
            <button className="hover:bg-gray-100 dark:hover:bg-gray-700 px-2 rounded-sm text-gray-400 dark:text-gray-500 cursor-pointer transition-colors">
                <PenLine className="w-4 h-4" />
            </button>
        </div>
    );
}
