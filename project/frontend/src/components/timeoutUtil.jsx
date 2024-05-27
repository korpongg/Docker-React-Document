let reloadTimeoutId;

export const setReloadTimeout = () => {
  // Clear any existing timeout
  clearTimeout(reloadTimeoutId);

  // Set a new timeout to reload the page after 30 seconds
  reloadTimeoutId = setTimeout(() => {
    window.location.reload(true);
    console.log("No data received for 30 seconds. Reloading the page.");
  }, 30000); // 30 seconds
};

export const clearReloadTimeout = () => {
  clearTimeout(reloadTimeoutId);
};

/*
import { setReloadTimeout, clearReloadTimeout } from './timeoutUtil';

// ...

useEffect(() => {
  setReloadTimeout(); // Call this function to set the initial timeout

  try {
    const socket = new WebSocket(`${apiBC}`);

    socket.addEventListener("open", () => {
      // ...

      socket.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);
        setReloadTimeout(); // Call this function when a message is received.

        // ...

        setLoading(false);
      });

      // ...
    });

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      clearReloadTimeout(); // Call this function to clear the timeout when the component unmounts.
      socket.close();
    };
  } catch (error) {
    console.error("Error establishing WebSocket connection:", error);
  }
}, []);
*/