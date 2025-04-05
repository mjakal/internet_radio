export const Loading = () => (
  <div className="col-span-12 space-y-6 xl:col-span-12 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <div className="flex justify-center my-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  </div>
)

export const NoData = () => (
  <div className="col-span-12 space-y-6 xl:col-span-12 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <div className="flex justify-center my-3">
      <p className="text-gray-500 dark:text-gray-400">
        Data not found.
      </p>
    </div>
  </div>
)