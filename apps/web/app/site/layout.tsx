import React from "react";

const SiteLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <main className="h-full">
            {children}
        </main>
    );
};

export default SiteLayout;
