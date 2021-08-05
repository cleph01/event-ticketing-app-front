import React from "react";

import { useHistory } from "react-router-dom";

import "../styles/home.scss";

import logo from "../assets/logo.png";

function Home() {
    const history = useHistory();

    return (
        <div className="container">
            <div className="header">
                {/* <div className="logo">
                    <img src={logo} alt="logo" />
                </div> */}
                <div className="menu-wrapper">
                    <ul className="menu">
                        <li>Calendar</li>
                        <li>News</li>
                        <li>Login</li>
                    </ul>
                </div>
            </div>
            <div className="body-wrapper">
                <div className="image-wrapper">
                    <img src={logo} alt="Salesman" />{" "}
                </div>

                <h3>Westchester's Premiere MMA Promotion</h3>
                <p>
                    Buy Tickets, Follow Up and Coming Local Fighters. Lorem
                    Ipsum is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry's standard dummy
                    text ever since the 1500s, when an unknown printer took a
                    galley of type and scrambled it to make a type specimen
                    book. It has survived not only five centuries, but also the
                    leap into electronic typesetting, remaining essentially
                    unchanged.
                </p>
                <div className="auth-buttons">
                    <div
                        className="buttons"
                        onClick={() => history.push("/purchase")}
                    >
                        Buy Tickets
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
