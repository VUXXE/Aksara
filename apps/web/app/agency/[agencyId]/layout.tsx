import React from "react";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

import { verifyInvitation } from "@/lib/queries/invitations";
import { getNotification } from "@/lib/queries/notifications";
import { getAuthUserDetails } from "@/lib/queries/agency";

import Sidebar from "@/components/navigation/sidebar";
import BlurPage from "@/components/common/blur-page";
import InfoBar from "@/components/common/info-bar";

interface AgencyIdLayoutProps extends React.PropsWithChildren {
    params: {
        agencyId: string | undefined;
    };
}

const AgencyIdLayout: React.FC<AgencyIdLayoutProps> = async ({
    params,
    children,
}) => {
    const user = await getAuthUserDetails();
    const agencyId = await verifyInvitation();

    if (!user) return redirect("/");
    if (!agencyId || !params.agencyId) return redirect("/agency");

    if (
        user.privateMetadata.role !== Role.AGENCY_OWNER &&
        user.privateMetadata.role !== Role.AGENCY_ADMIN
    ) {
        return redirect("/agency/unauthorized");
    }

    const notifications = await getNotification(agencyId);

    return (
        <div className="h-screen overflow-hidden">
            <Sidebar id={params.agencyId} type="agency" />
            <div className="md:pl-[300px]">
                <InfoBar
                    notifications={notifications}
                    subAccountId={user.id}
                    role={user.privateMetadata.role as Role}
                />
                <div className="relative">
                    <BlurPage>{children}</BlurPage>
                </div>
            </div>
        </div>
    );
};

export default AgencyIdLayout;
