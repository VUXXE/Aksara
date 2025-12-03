import React from "react";
import { redirect } from "next/navigation";
import { Plan, Role } from "@prisma/client";

import { getAuthUserDetails } from "@/lib/queries/auth";
import { verifyInvitation } from "@/lib/queries/invitations";
import AgencyDetails from "@/components/forms/agency-details";
import Unauthorized from "@/components/unauthorized";
import { createClient } from "@/lib/supabase/server";

interface AgencyPageProps {
    searchParams: {
        plan: Plan | undefined;
        state: string | undefined;
        code: string | undefined;
    };
}

const AgencyPage = async ({ searchParams }: AgencyPageProps) => {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        return redirect("/agency/sign-in");
    }

    const agencyId = await verifyInvitation();
    const user = await getAuthUserDetails();

    const isSubAccountUser =
        user?.role === Role.SUBACCOUNT_GUEST || user?.role === Role.SUBACCOUNT_USER;
    const isAgencyUser =
        user?.role === Role.AGENCY_OWNER || user?.role === Role.AGENCY_ADMIN;

    if (agencyId) {
        if (isSubAccountUser) {
            return redirect("/subaccount");
        } else if (isAgencyUser) {
            if (searchParams.plan) {
                return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`);
            }

            if (searchParams.state) {
                const statePath = searchParams.state.split("___")[0];
                const stateAgencyId = searchParams.state.split("___")[1];

                if (!stateAgencyId) return <div>Not authorized.</div>;

                return redirect(
                    `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
                );
            }

            return redirect(`/agency/${agencyId}`);
        }

        return <Unauthorized />;
    }

    return (
        <div className="flex justify-center items-center mt-4 min-h-screen bg-background">
            <div className="max-w-[850px] flex flex-col gap-8 w-full px-4">
                {/* <h1 className="text-4xl">Create An Agency</h1> */}
                <AgencyDetails
                    data={{ companyEmail: authUser.email }}
                />
            </div>
        </div>
    );
};

export default AgencyPage;
