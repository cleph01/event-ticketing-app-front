import { Redirect, Route } from "react-router-dom";

const AdminRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            localStorage.getItem("admin") ? (
                <Component {...props} />
            ) : (
                <Redirect to="/login" />
            )
        }
    />
);

const ScannerRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            localStorage.getItem("token") ? (
                <Component {...props} />
            ) : (
                <Redirect to="/login" />
            )
        }
    />
);

export { AdminRoute, ScannerRoute };
