'use server';

import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "./firebase";
import type { Group } from "./types";

export async function getGroupDetailsByJoinCode(joinCode: string): Promise<Group | null> {
    if (!joinCode || typeof joinCode !== 'string') {
        return null;
    }
    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, where('joinCode', '==', joinCode.toUpperCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const groupDoc = querySnapshot.docs[0];
    const group = groupDoc.data() as Group;
    // Return a plain object to ensure it's serializable for client components
    return {
        id: group.id,
        name: group.name,
        joinCode: group.joinCode,
        createdAt: group.createdAt,
        createdBy: group.createdBy,
    };
}
