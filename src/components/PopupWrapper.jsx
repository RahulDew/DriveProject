
const PopupWrapper = ({ children, handleWrapperClose }) => {
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto no-scrollbar">
      <div
        onClick={handleWrapperClose}
        className={
          "fixed inset-0 bg-gray-800 opacity-70 dark:bg-slate-950 dark:opacity-80 transition-opacity"
        }
      ></div>
      <div className="min-h-screen flex items-center justify-center sm:p-4 text-center sm:items-center">
        {children}
      </div>
    </div>
  );
};

export default PopupWrapper;
