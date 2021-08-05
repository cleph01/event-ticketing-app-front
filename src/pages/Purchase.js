import React, { useState, useContext } from "react";

import UserContext from "../context/user";

// Paypal Checkout package
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import { useHistory, Link } from "react-router-dom";

import axios from "axios";

import Logo from "../assets/logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styles/auth.scss";

function Copyright() {
    return (
        <div>
            {"Copyright © "}
            <a href="https://smartseedtech.com/">SmartSeed LLC</a>{" "}
            {new Date().getFullYear()}
            {"."}
        </div>
    );
}

function Purchase() {
    const history = useHistory();

    const { dispatch } = useContext(UserContext);

    const initialState = {
        name: "",
        email: "",
        password: "",
        isSubmitting: false,
        errorMessage: null,
        successMessage: null,
    };

    const [userData, setUserData] = useState(initialState);

    const [quantity, setQuantity] = useState(0);
    const [total, setTotal] = useState(0);

    const handleSelect = (e) => {
        setQuantity(e.target.value);
        setTotal(e.target.value * 50);
    };

    const handleInputChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value,
        });

        localStorage.setItem(event.target.name, event.target.value);
    };

    const handleSignup = async () => {
        setUserData({
            ...userData,
            isSubmitting: true,
            errorMessage: null,
            successMessage: null,
        });

        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email");
        const password = localStorage.getItem("password");

        // Simple Form Validation
        if (email === "" || password === "") {
            setUserData({
                ...userData,
                errorMessage: "Fields Cannot Be Empty",
            });
        } else {
            await axios
                .post("http://localhost:5000/api/auth/signup", {
                    name: name,
                    email: email,
                    password: password,
                })
                .then((res) => {
                    if (res.status === 201) {
                        return res.data;
                    } else {
                        console.log("Response Error: ", res);
                        throw res;
                    }
                })
                .then((responseData) => {
                    const { message } = responseData;

                    console.log("Succes Message: ", message);

                    dispatch({
                        type: "SIGNUP",
                        payload: message,
                    });

                    localStorage.removeItem("email");
                    localStorage.removeItem("password");

                    setUserData({
                        ...userData,
                        successMessage: "Approved! Logging You In...",
                    });

                    history.push("/search");
                })
                .catch((error) => {
                    console.log("Axios Post Error: ", error);
                    setUserData({
                        ...userData,
                        isSumbitting: false,
                        errorMessage: error.message || error.statusText,
                    });
                });
        }
        // history.push("/search");
    };

    console.log("User Signup: ", userData);

    console.log("Storage Name: ", localStorage.getItem("name"));
    console.log("Storage Email: ", localStorage.getItem("email"));
    console.log("Storage Password: ", localStorage.getItem("password"));

    const [{ isPending }] = usePayPalScriptReducer();

    console.log("isPending", isPending);

    const [capturedDetails, setCapture] = useState();

    const [isPurchasing, setPurchasing] = useState(false);

    console.log("Quantity Selected: ", quantity);

    return (
        <div className="form__container">
            <div className="logo__container">
                <img src={Logo} alt="logo" />
            </div>
            <div>General Admission = $50.00</div>
            {/* Error Message */}
            {userData.errorMessage && (
                <div className="error__msg">
                    <FontAwesomeIcon
                        className="error-icon"
                        icon="exclamation-triangle"
                    />
                    {"  " + userData.errorMessage}
                </div>
            )}
            {userData.successMessage && (
                <div className="success__msg">
                    <FontAwesomeIcon
                        className="success-icon"
                        icon="check-circle"
                    />
                    {"  " + userData.successMessage + "  "}
                    <FontAwesomeIcon className="spinner" icon="spinner" />
                </div>
            )}
            <div className="form__group field">
                <div className="quantity__selector">
                    <select
                        id="quantity"
                        onChange={handleSelect}
                        value={quantity}
                    >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="14">14</option>
                        <option value="15">15</option>
                        <option value="16">16</option>
                        <option value="17">17</option>
                        <option value="18">18</option>
                    </select>
                    <p></p>
                    {quantity && (
                        <p>
                            Quantity Selected: {quantity} - Total: {total}
                        </p>
                    )}
                </div>
            </div>
            <div className="form__group field">
                <input
                    type="input"
                    className="form__field"
                    placeholder="First Name"
                    name="name"
                    id="name"
                    required
                    onChange={handleInputChange}
                />
                <label htmlFor="email" className="form__label">
                    First Name
                </label>
            </div>
            <div className="form__group field">
                <input
                    type="input"
                    className="form__field"
                    placeholder="Email"
                    name="email"
                    id="email"
                    required
                    onChange={handleInputChange}
                />
                <label htmlFor="email" className="form__label">
                    Email
                </label>
            </div>

            {/* <div
                className="auth__btn"
                disabled={userData.isSubmitting ? true : false}
                onClick={handleSignup}
            >
                {userData.isSubmitting ? "Loading..." : "Signup"}
            </div> */}

            {isPending ? (
                <FontAwesomeIcon className="spinner" icon="spinner" />
            ) : (
                <div className="paypal__btn">
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: total,
                                        },
                                    },
                                ],
                            });
                        }}
                        onApprove={async (data, actions) => {
                            return await actions.order
                                .capture()
                                .then((approvedDetails) => {
                                    setCapture(approvedDetails);

                                    console.log(
                                        "Transaction Complete: ",
                                        approvedDetails
                                    );

                                    console.log(
                                        "Approved Details: ",
                                        approvedDetails
                                    );

                                    handleSignup();

                                    setUserData({
                                        ...userData,
                                        successMessage:
                                            "Approved! Logging You In...",
                                    });
                                });
                        }}
                    />
                </div>
            )}
            <div className="redirect__link">
                <Link className="link" to="/login">
                    Already have an account? <u>Login</u>
                </Link>
            </div>
            <div className="copyright">{Copyright()}</div>
        </div>
    );
}

export default Purchase;
