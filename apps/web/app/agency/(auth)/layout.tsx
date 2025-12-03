import React from "react";

const AuthLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <div className="h-full flex items-center justify-center">{children}</div>
    );
};

export default AuthLayout;
