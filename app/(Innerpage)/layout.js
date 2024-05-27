import React from "react";
import Navbar from "./(components)/Navbar";

const InnerLayout = ({ children }) => {
  return (
    <section className="w-full bg-white  justify-center">
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className="max-w-[600px] h-full w-full mx-auto border">

      <Navbar />

      <main className="  flex-1 h-screen overflow-y-auto bg-[#e5e5e5]">
        {children}
      </main>

      {/* <footer className="bg-red-500 h-16 flex justify-center items-center"> */}
        {/* Footer content */}
      {/* </footer> */}
      </div>
    </section>
  );
};

export default InnerLayout;
