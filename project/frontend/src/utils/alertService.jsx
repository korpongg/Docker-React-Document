import Swal from "sweetalert2";

const showAlert = (message, title = "Notification", icon = "warning") => {
    const alertTitle = title && title.trim() !== "" ? title : "Notification";

    Swal.fire({
        title: alertTitle,
        text: message,
        icon: icon,
        confirmButtonText: "ตกลง",
    });
};

export default showAlert;