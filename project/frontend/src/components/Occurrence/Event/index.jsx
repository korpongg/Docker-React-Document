import React, { useState, useEffect } from "react";
import TranferTable from "../Dashboard/TranferTable";
import { EventBox } from "../../../styles/Event.style";

const EventOcc = () => {
    const [rowData, setRowData] = useState(null);
    const [eventData, setEventData] = useState([]);

    return (
        <EventBox>
            <h1>รายงานอุบัติการณ์ที่เกี่ยวข้องกับแผนก</h1>
            <TranferTable
                reportData={rowData}
                eventData={eventData}
            />
        </EventBox>
    )
}

export default EventOcc;