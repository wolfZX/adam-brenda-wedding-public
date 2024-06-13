'use client'

import LoadSpinner from "../frontend/components/load-spinner";

export default function Loading() {
    return (
      <div className="bg-blue-dark w-screen h-screen flex flex-col items-center justify-center text-white">
        <div className="w-[100px] h-[100px] mb-4">
          <LoadSpinner loading />
        </div>
        <p>Loading...</p>
      </div>
    );
  }