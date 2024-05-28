let reloadTimeoutId;

export const setReloadTimeout = () => {
  // Clear any existing timeout
  clearTimeout(reloadTimeoutId);

  // Set a new timeout to reload the page after 40 seconds
  reloadTimeoutId = setTimeout(() => {
    window.location.reload(true);
    console.log("No data received for 40 seconds. Reloading the page.");
  }, 40000); // 40 seconds
};

export const clearReloadTimeout = () => {
  clearTimeout(reloadTimeoutId);
};