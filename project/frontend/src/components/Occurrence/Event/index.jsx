import React, { useState, useEffect } from "react";
import { useWebSocket } from '../../../context/WebSocketContext';
import { useNavigate } from 'react-router-dom';

import { chkAdmins, chkAdmin } from "../../Function";
import TranferTable from "../Dashboard/TranferTable";
import { EventBox } from "../../../styles/Event.style";

const EventOcc = () => {
    const { connectWebSocket, disconnectWebSocket, dataEvent, load } = useWebSocket();
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    const userData = storedAuth ? JSON.parse(localStorage.getItem("userData")) : null;
    const isAdmin = chkAdmins(userData?.role);
    const isEXEC = chkAdmin(userData?.level);
    const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
    const [eventData, setEventData] = useState([]);
    const [loading, setLoading] = useState(load);

    useEffect(() => {
        connectWebSocket();
        return () => {
            disconnectWebSocket();
        };
    }, []);

    useEffect(() => {
        let filteredData = dataEvent;
        if (!isAdmin) {
            filteredData = dataEvent.filter(item => item.depname === userData.dep);
        }
        setEventData(filteredData);
        setLoading(false);
    }, [dataEvent]);

    return (
        <EventBox>
            <h1>รายงานอุบัติการณ์ที่เกี่ยวข้องกับแผนก</h1>
            <TranferTable
                dataEvent={eventData}
                isAdmin={isAdmin}
                userData={userData}
                config={config}
                loading={loading}
                setLoading={setLoading}
            />
        </EventBox>
    );
};

export default EventOcc;