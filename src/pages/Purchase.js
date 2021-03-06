import React, { useState, useContext } from "react";

import firebase from "firebase";

import { db } from "../firebase";

import UserContext from "../context/user";

// Paypal Checkout package
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

import { useHistory, Link } from "react-router-dom";

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

    const initialState = {
        name: "",
        email: "",
        isSubmitting: false,
        errorMessage: null,
        successMessage: null,
    };

    const [userData, setUserData] = useState(initialState);

    const [quantity, setQuantity] = useState(0);
    const [totalValue, setTotal] = useState("0.00");

    const [orderNum, setOrderNum] = useState();

    const [capturedDetails, setCapture] = useState();
    const [{ isPending }] = usePayPalScriptReducer();

    const handleSelect = (e) => {
        setQuantity(e.target.value);
        setTotal((e.target.value * 50.0).toFixed(2));
    };

    const handleInputChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value,
        });
    };

    const createOrder = (data, actions) => {
        console.log("Total in CreateOrder: ", totalValue);

        return actions.order
            .create({
                purchase_units: [
                    {
                        amount: {
                            value: totalValue,
                        },
                    },
                ],
            })
            .then((orderId) => {
                console.log("Order ID: ", orderId);
                return orderId;
            });
    };

    const onApprove = async (data, actions) => {
        return await actions.order
            .capture()
            .then((approvedDetails) => {
                setCapture(approvedDetails);

                console.log("Transaction Complete: ", approvedDetails);

                console.log("Approved Details: ", approvedDetails);

                // handleSignup();

                setUserData({
                    ...userData,
                    successMessage: "Approved! Logging You In...",
                });

                createRecord(approvedDetails.id, userData);

                // history.push(`/receipt/${orderNum}`);

                history.push(`/ticket/${orderNum}`);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    };

    const onError = (error) => {
        console.log("El Error: ", error);
    };

    const createRecord = async (transactionId, user) => {
        await db
            .collection("orders")
            .add({
                paypalId: transactionId,
                name: userData.name,
                email: userData.email,
                timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((docRef) => {
                console.log("Insert Response w/ ID: ", docRef.id);

                setOrderNum(docRef.id);

                console.log("Set Order Num: ", orderNum);

                // loop per quantity bought and creat a batch insert
                // to account for each ticket
                const batch = db.batch();

                for (let i = 0; i < quantity; i++) {
                    const ticketRef = db
                        .collection("orders")
                        .doc(docRef.id)
                        .collection("tickets")
                        .doc();

                    batch.set(ticketRef, {
                        ticket_num:
                            firebase.firestore.FieldValue.serverTimestamp(),
                        validated: "n",
                    });
                }

                batch
                    .commit()
                    .then((response) => {
                        console.log("Batch Response: ", response);
                    })
                    .catch((error) => {
                        console.log("Batch Error: ", error);
                    });
            })
            .catch((error) => {
                console.log("Create Record Error: ", error);
            });
    };

    console.log("isPending", isPending);

    console.log("Quantity Selected: ", quantity);

    console.log("Total Value: ", totalValue, "- Type of: ", typeof totalValue);

    console.log("User Data: ", userData);

    const displayTotal = () => {
        return totalValue;
    };

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
                        id="ticketSelector"
                        onChange={handleSelect}
                        value={totalValue}
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
                            Quantity Selected: {quantity} - Total: {totalValue}
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

            {isPending ? (
                <FontAwesomeIcon className="spinner" icon="spinner" />
            ) : (
                <div className="paypal__btn">
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        forceReRender={[totalValue]}
                    />
                </div>
            )}

            <button onClick={createRecord}>Create Record</button>

            <div className="copyright">{Copyright()}</div>
        </div>
    );
}

export default Purchase;
