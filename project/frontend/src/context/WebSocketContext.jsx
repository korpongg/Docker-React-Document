import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  // 🔥 ใช้ Map กัน request ซ้ำ
  const requestQueue = useRef(new Map());

  const reconnectTimeoutRef = useRef(null);
  const heartbeatRef = useRef(null);
  const connectingRef = useRef(false);

  const [isConnected, setIsConnected] = useState(false);

  const [dataCenter, setDataCenter] = useState([]);
  const [dataCenter2, setDataCenter2] = useState([]);
  const [dataCenter3, setDataCenter3] = useState([]);
  const [dataCenter4, setDataCenter4] = useState([]);

  const [load, setLoad] = useState(false);

  const WS_URL =
    `${import.meta.env.VITE_REACT_APP_API_BC_PREFIX}` +
    `${window.location.hostname}` +
    `${import.meta.env.VITE_REACT_APP_API_BC}`;

  // =========================
  // clear timers
  // =========================
  const clearTimers = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  };

  // =========================
  // heartbeat
  // =========================
  const startHeartbeat = (ws) => {
    heartbeatRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "PING" }));
      }
    }, 30000);
  };

  // =========================
  // flush queue (ส่งทีเดียวตอน connect)
  // =========================
  const flushQueue = (ws) => {
    requestQueue.current.forEach((req) => {
      ws.send(JSON.stringify(req));
    });

    requestQueue.current.clear();
  };

  // =========================
  // CONNECT
  // =========================
  const connectWebSocket = useCallback(() => {
    // 🔥 ถ้า OPEN อยู่แล้ว ไม่ต้อง connect ใหม่
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      return;
    }

    // 🔥 ถ้ากำลัง CONNECTING อยู่
    if (connectingRef.current) {
      return;
    }


    connectingRef.current = true;

    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {

      setIsConnected(true);
      connectingRef.current = false;

      clearTimers();
      startHeartbeat(ws);

      // 🔥 ส่ง queue ครั้งเดียว
      flushQueue(ws);
    };

    ws.onclose = () => {

      setIsConnected(false);

      clearTimers();

      socketRef.current = null;
      connectingRef.current = false;

      reconnectTimeoutRef.current = setTimeout(() => {
        connectWebSocket();
      }, 2000);
    };

   ws.onerror = (err) => {
  console.error("🚨 WebSocket error:", err);
  console.error("URL:", WS_URL);
};
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === "PONG") return;

        if (message.type === "CENTER_DATA") {
          switch (message.requestType) {
            case "DATA1":
              setDataCenter(message.data || []);
              break;

            case "DATA2":
              setDataCenter2(message.data || []);
              break;

            case "DATA3":
              setDataCenter3(message.data || []);
              break;

            case "DATA4":
              setDataCenter4(message.data || []);
              break;

            default:
              console.warn(
                "⚠️ Unknown requestType:",
                message.requestType
              );
              break;
          }

          setLoad(false);
        }

    if (message.type === "FORCE_REFRESH") {

  window.dispatchEvent(
    new CustomEvent("force-refresh", {
      detail: message, // ✅ ส่งทั้งหมด
    })
  );
}
      } catch (error) {
        console.error("❌ Parse message error:", error);
      }
    };
  }, [WS_URL]);

  // =========================
  // REQUEST DATA
  // =========================
  const requestData = useCallback(
    (requestType, payload = {}) => {
      const request = {
        type: "GET_DATA",
        requestType,
        payload,
      };

      const ws = socketRef.current;

      setLoad(true);

      // =========================
      // ถ้าเปิดแล้ว ส่งทันที
      // =========================
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(request));
        return;
      }

      // =========================
      // กัน request DATA2 ซ้ำตอนยังไม่ connect
      // =========================
      requestQueue.current.set(requestType, request);


      // =========================
      // ถ้ายังไม่มี socket หรือ close
      // =========================
      if (
        !ws ||
        ws.readyState === WebSocket.CLOSED
      ) {
        connectWebSocket();
      }
    },
    [connectWebSocket]
  );

  // =========================
  // DISCONNECT
  // =========================
 const disconnectWebSocket = useCallback(() => {
  clearTimers();

  if (socketRef.current) {
    // 🔥 สำคัญ: เช็ค state ก่อน
    if (socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }

    socketRef.current = null;
  }

  connectingRef.current = false;
  setIsConnected(false);
}, []);

  // =========================
  // AUTO CONNECT ONCE
  // =========================
  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        connectWebSocket,
        disconnectWebSocket,
        requestData,
        isConnected,
        dataCenter,
        dataCenter2,
        dataCenter3,
        dataCenter4,
        load,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};