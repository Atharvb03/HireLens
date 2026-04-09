const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Recruitment Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">Streamline your hiring process with intelligent insights</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@recruitai.com</p>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  AU
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
