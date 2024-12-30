import React from "react";
import { useLocation, Link } from "react-router-dom";
import breadcrumbRoutes from "../../../../config/breadCrumsConfig"; // Adjust the path as needed

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <nav>
            <ol style={{ display: "flex", listStyle: "none", padding: 0 }}>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const route = breadcrumbRoutes.find((route) => route.path === to);
                    return route ? (
                        <li key={to} style={{ margin: "0 5px" }}>
                            / <Link to={to}>{route.breadcrumb}</Link>
                        </li>
                    ) : null;
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
