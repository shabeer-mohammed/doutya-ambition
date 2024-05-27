import React from "react";
import HomeNavbar from "./(components)/HomeNavbar";

const HomeLayout = ({ children }) => {
  return (
    <section className="w-full bg-gradient-to-r min-h-screen from-green-500 to-green-700 justify-center">
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className="max-w-[600px] h-full w-full mx-auto">
      <HomeNavbar />
     

      <main className="  flex-1 h-full overflow-y-auto p-3 ">
        {children}
      </main>

      
      </div>
    </section>
  );
};

export default HomeLayout;