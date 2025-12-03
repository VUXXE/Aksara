"use server";

import { db } from "@/lib/db";
import { logger } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { type NotificationsWithUser } from "@/lib/types";

export const saveActivityLogsNotification = async ({
    agencyId,
    description,
    subAccountId,
}: {
    agencyId?: string;
    subAccountId?: string;
    description: string;
}) => {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    let userData;

    if (!authUser) {
        const response = await db.user.findFirst({
            where: {
                agency: {
                    subAccounts: {
                        some: {
                            id: subAccountId,
                        },
                    },
                },
            },
        });

        if (response) {
            userData = response;
        }
    } else {
        const response = await db.user.findUnique({
            where: {
                email: authUser.email,
            },
        });

        if (response) {
            userData = response;
        }
    }

    if (!userData) {
        console.log("Could not find a user");
        return;
    }

    let foundAgencyId = agencyId;

    if (!foundAgencyId) {
        if (!subAccountId) {
            throw new Error(
                "You need to provide at least an agency id or subaccount id"
            );
        }

        const response = await db.subAccount.findUnique({
            where: {
                id: subAccountId,
            },
        });

        if (response) {
            foundAgencyId = response.agencyId;
        }
    }

    if (subAccountId) {
        await db.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                user: {
                    connect: {
                        id: userData.id,
                    },
                },
                agency: {
                    connect: {
                        id: foundAgencyId,
                    },
                },
                subAccount: {
                    connect: {
                        id: subAccountId,
                    },
                },
            },
        });
    } else {
        await db.notification.create({
            data: {
                notification: `${userData.name} | ${description}`,
                user: {
                    connect: {
                        id: userData.id,
                    },
                },
                agency: {
                    connect: {
                        id: foundAgencyId,
                    },
                },
            },
        });
    }
};

export const getNotification = async (agencyId: string) => {
    try {
        const response = await db.notification.findMany({
            where: {
                agencyId,
            },
            include: {
                user: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return response as NotificationsWithUser;
    } catch (error) {
        logger(error);
    }
};
