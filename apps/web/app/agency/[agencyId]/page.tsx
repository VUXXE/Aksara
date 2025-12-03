import React from "react";

const Page = ({ params }: { params: { agencyId: string } }) => {
    return <div>Agency Dashboard: {params.agencyId}</div>;
};

export default Page;
