'use client'

import { useEffect } from "react"
import Button from "../frontend/components/button";

// Catches the children's layout error only
// If want to catch error in root, have to use global-error.jsx but still preferably to create error.jsx for each children layout
export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error);
    });

    return (
        <div className="bg-blue-dark w-screen h-screen flex flex-col justify-center items-center text-center text-white">
            <h3 className="mb-4">Oops! Something went wrong!</h3>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    )
  }