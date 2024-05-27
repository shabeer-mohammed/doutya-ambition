import React from "react";

const HomeLayout = ({ children }) => {
  return (
    <section className="w-full  h-screen">
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className="max-w-[600px] h-full w-full mx-auto border">
     

      <main className="  flex-1 h-full overflow-y-auto  ">
        {children}
      </main>

      
      </div>
    </section>
  );
};

export default HomeLayout;