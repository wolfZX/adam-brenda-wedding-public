'use client'

import { useRouter } from 'next/navigation'

import Button from "../frontend/components/button";

export default function NotFound() {
  const router = useRouter();

    return (
      <div className="bg-blue-dark w-screen h-screen flex flex-col justify-center items-center text-center text-white">
          <h3>Oops! Looks like a dead end, hero.</h3>
          <p className="mb-4">Click &quot;Turn back&quot; to go back to the main page.</p>
          <Button onClick={() => router.replace('/')}>
            Turn back
          </Button>
      </div>
    );
  }