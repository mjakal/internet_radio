export const Loading = () => (
  <div className="col-span-12 space-y-6 rounded-2xl border border-gray-200 bg-white p-5 xl:col-span-12 dark:border-gray-800 dark:bg-white/[0.03]">
    <div className="my-8 flex justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  </div>
);

export const NoData = () => (
  <div className="col-span-12 space-y-6 rounded-2xl border border-gray-200 bg-white p-5 xl:col-span-12 dark:border-gray-800 dark:bg-white/[0.03]">
    <div className="my-3 flex justify-center">
      <p className="text-gray-500 dark:text-gray-400">Data not found.</p>
    </div>
  </div>
);
