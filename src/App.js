import { lazy, Suspense, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import UserContext from "./context/user";

// START import protected Routes
import {
    AdminRoute,
    ScannerRoute,
} from "./protected-routes/protected-routes.js";
// END import protected Routes

// Import AuthReducer to manage state change in Context API
import AuthReducer from "./reducers/auth-reducer/auth-reducer.js";

// Paypal Checkout package
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// START FontAwesome
import { library } from "@fortawesome/fontawesome-svg-core";

import {
    faSearch,
    faBars,
    faLink,
    faExclamationTriangle,
    faCheckCircle,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";

library.add(
    faBars,
    faSearch,
    faLink,
    faExclamationTriangle,
    faCheckCircle,
    faSpinner
);
// END FontAwesome

// START Lazy Rendering functions
const Home = lazy(() => import("./pages/Home.js"));
const Admin = lazy(() => import("./pages/Admin.js"));
const NotFound = lazy(() => import("./pages/NotFound.js"));
const Login = lazy(() => import("./pages/Login.js"));
const Scan = lazy(() => import("./pages/Scanner.js"));
const Purchase = lazy(() => import("./pages/Purchase.js"));
const Ticket = lazy(() => import("./pages/Ticket.js"));
// END Lazy Rendering functions

const initialState = {
    isAuthenticated: false,
    id: null,
    token: null,
    name: null,
};

function App() {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    console.log("Load up: ", state);

    const initialOptions = {
        "client-id":
            "ARaJiZis6nTJDNMxvi4MmqTIFLH0Bo3f9x3jbovK3fgcfDYcnbUhh7RUAdPbPXlUvtH6NmcluqsAawLn",
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <UserContext.Provider value={{ state, dispatch }}>
                <Router>
                    <Suspense fallback={<p>Loading...</p>}>
                        <Switch>
                            <Route exact path={ROUTES.HOME} component={Home} />
                            <Route path={ROUTES.LOGIN} component={Login} />
                            <Route
                                path={ROUTES.PURCHASE}
                                component={Purchase}
                            />
                            <Route path={ROUTES.SCAN} component={Scan} />

                            <Route path={ROUTES.TICKET} component={Ticket} />

                            <AdminRoute path={ROUTES.ADMIN} component={Admin} />
                            {/* <ScannerRoute path={ROUTES.SCAN} component={Scan} /> */}

                            <Route component={NotFound} />
                        </Switch>
                    </Suspense>
                </Router>
            </UserContext.Provider>
        </PayPalScriptProvider>
    );
}

export default App;
