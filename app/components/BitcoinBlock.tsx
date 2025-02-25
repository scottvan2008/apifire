"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function BitcoinBlock() {
    const [blockHeight, setBlockHeight] = useState<number | null>(null);
    const [halvingTime, setHalvingTime] = useState<string | null>(null); // Change to string
    const [nextHalvingBlock, setNextHalvingBlock] = useState<number | null>(
        null
    );

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "bitcoin", "latest");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setBlockHeight(data.height);
                setHalvingTime(data.halvingTime); // Keep as string
                setNextHalvingBlock(data.nextHalvingBlock);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Calculate time remaining
    const remainingTime = halvingTime
        ? (new Date(halvingTime).getTime() - Date.now()) / 1000 / 60
        : 0; // Use the string halvingTime here

    return (
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold">Bitcoin Block Height</h1>
            <p className="text-xl">{blockHeight ?? "Loading..."}</p>
            {halvingTime && (
                <p className="text-lg mt-4">
                    Next Halving at Block #{nextHalvingBlock}
                    <br />
                    Next Halving in:{" "}
                    {remainingTime > 0
                        ? `${Math.round(remainingTime)} minutes`
                        : "Already happening!"}
                    <br />
                    <span className="mt-2">Halving Time: {halvingTime}</span>
                </p>
            )}
        </div>
    );
}
