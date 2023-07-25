import React, { useEffect } from "react";
import Home from "../home";

const Dashboard = (props) => {
    useEffect(() => {
        // props.navigation.navigate("Home");
    }, []);
    return (
        <>
            <Home />
        </>
    );
};

export default Dashboard;
