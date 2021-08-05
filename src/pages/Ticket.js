import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBarcode } from "@createnextapp/react-barcode";
import JsBarcode from "jsbarcode";
import { createCanvas } from "canvas";

import logo from "../assets/logo.png";

import "../styles/ticket.scss";

function Ticket() {
    const params = useParams();

    const orderArr = ["11", "12", "13", "14"];

    useEffect(() => {
        // JsBarcode(".barcode").init();
        for (let i = 0; i < orderArr.length; i++) {
            JsBarcode(`#a${i}`, "Hi! " + i);
        }
    }, []);

    return (
        <>
            <div className="container">
                <div className="event__container">
                    <div className="logo">
                        <img src={logo} alt="logo" />
                    </div>
                    <div className="event-details">
                        <h3>Event Name</h3>
                        <h4>Day</h4>
                        <h5>Time</h5>
                    </div>

                    <div className="ticket__wrapper">
                        {orderArr.map((ticketNum, index) => {
                            return (
                                <div className="ticket-box">
                                    <svg id={"a" + index}></svg>
                                    <div>Seating Information</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Ticket;
