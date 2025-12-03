"use server";

import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { saveActivityLogsNotification } from "./notifications";

export const verifyInvitation = async () => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.email) {
        return redirect("/agency/sign-in");
    }

    const invitationExists = await db.invitation.findUnique({
        where: {
            email: user.email,
            status: "PENDING",
        },
    });

    if (invitationExists) {
        const userDetails = await db.user.findUnique({
            where: {
                email: user.email,
            },
        });

        if (userDetails) {
            await db.user.update({
                where: {
                    email: user.email,
                },
                data: {
                    role: invitationExists.role,
                    agencyId: invitationExists.agencyId,
                },
            });

            await saveActivityLogsNotification({
                agencyId: invitationExists.agencyId,
                description: `Joined`,
                subAccountId: undefined,
            });

            await db.invitation.delete({
                where: {
                    email: user.email,
                },
            });

            return invitationExists.agencyId;
        } else {
            // Create user if they don't exist (should be handled by initUser but just in case)
            const newAgencyUser = await db.user.create({
                data: {
                    email: user.email,
                    agencyId: invitationExists.agencyId,
                    avatarUrl: user.user_metadata.avatar_url || "",
                    id: user.id,
                    name: user.user_metadata.full_name || user.email.split("@")[0],
                    role: invitationExists.role,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            await saveActivityLogsNotification({
                agencyId: invitationExists.agencyId,
                description: `Joined`,
                subAccountId: undefined,
            });

            await db.invitation.delete({
                where: {
                    email: user.email,
                },
            });

            return newAgencyUser.agencyId;
        }
    } else {
        const user = await db.user.findUnique({
            where: {
                email: user.email,
            },
        });

        return user ? user.agencyId : null;
    }
};
