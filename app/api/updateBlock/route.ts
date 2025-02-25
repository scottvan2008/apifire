import { NextResponse } from "next/server";
import { db } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function GET() {
    try {
        console.log("Fetching Bitcoin block height...");
        const response = await fetch(
            "https://blockstream.info/api/blocks/tip/height"
        );
        const blockHeight = await response.text();

        console.log("Fetched block height:", blockHeight);

        await setDoc(doc(db, "bitcoin", "latest"), {
            height: parseInt(blockHeight, 10),
            updatedAt: serverTimestamp(),
        });

        console.log("Updated Firestore successfully!");
        return NextResponse.json({ height: blockHeight });
    } catch (error) {
        console.error("Error fetching block height:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
