import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import "../styles/receipt.scss";

function Receipt() {
    const params = useParams();

    const [sent, setSend] = useState(false);
    const [error, setError] = useState();
    const [text, setText] = useState("");

    useEffect(() => {
        axios
            .post("http://localhost:5000/send_mail", {
                orderNum: params.orderNum,
            })
            .then((res) => {
                console.log("Response: ", res.data);
                setSend(true);
            })
            .catch((error) => {
                console.log("Error: ", error);
                setError(error);
            });
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();

        setSend(true);

        await axios
            .post("http://localhost:5000/send_mail", {
                text,
                orderNum: params.orderNum,
            })
            .then((res) => {
                console.log("Response: ", res.data);
            })
            .catch((error) => {
                console.log("Error: ", error);
            });
    };

    return (
        <div>
            {!sent ? (
                // <form>
                //     <input
                //         type="text"
                //         value={text}
                //         onChange={(e) => setText(e.target.value)}
                //     />
                //     <button onClick={handleSend}>Send Email</button>
                // </form>
                <h1>There was a problem sending your email</h1>
            ) : (
                <h1> Email Sent</h1>
            )}
        </div>
    );
}

export default Receipt;
