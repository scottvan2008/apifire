"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function BitcoinBlock() {
    const [blockHeight, setBlockHeight] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "bitcoin", "latest");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setBlockHeight(docSnap.data().height);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold">Bitcoin Block Height</h1>
            <p className="text-xl">{blockHeight ?? "Loading..."}</p>
        </div>
    );
}
