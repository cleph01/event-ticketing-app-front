import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";

import { useBarcode } from "@createnextapp/react-barcode";
import JsBarcode from "jsbarcode";
import { createCanvas } from "canvas";

import logo from "../assets/logo.png";

import "../styles/ticket.scss";

function Ticket() {
    const params = useParams();

    const orderNum = params.orderNum;

    const [tickets, setTickets] = useState([]);

    // const orderArr = ["11", "12", "13", "14"];

    console.log("OrderNum: ", orderNum);

    useEffect(() => {
        db.collection("orders")
            .doc(orderNum)
            .collection("tickets")
            .where("validated", "==", "n")
            .get()
            .then((querySnapshot) => {
                setTickets(querySnapshot.docs.map((doc) => doc));
            });

        console.log("Tickets: ", tickets);
    }, [orderNum]);

    useEffect(() => {
        if (tickets) {
            for (let i = 0; i < tickets.length; i++) {
                JsBarcode(`#a${i}`, tickets[i].id);
            }
        }
    }, [tickets]);

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
                        {tickets.map((ticket, index) => {
                            return (
                                <div key={index} className="ticket-box">
                                    <svg id={"a" + index}></svg>
                                    <div>
                                        Validated: {ticket.data().validated}
                                    </div>
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
