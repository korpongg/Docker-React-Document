import styled from "styled-components";
import Box from "@mui/material/Box";

export const LoginBox = styled(Box)`
  text-align: center;
  background: linear-gradient(135deg, #0c065fff, #0f2c76ff);
.swal-radius {
  border-radius: 20px !important;
}

.swal-modern {
  border-radius: 20px !important;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25) !important;
  padding: 30px !important;
}

.swal-title-modern {
  font-size: 24px !important;
  font-weight: 700 !important;
  color: #166534 !important;
}

  .login {
    overflow: hidden;
    background-color: white;
    padding: 44px;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 480px;
    transform: translate(-50%, -50%);
    transition: transform 300ms, box-shadow 300ms;
    box-shadow: 5px 5px 10px 0px rgb(0 184 255 / 30%);
  }

  .login h1 {
    color: #5b5b5b;
    font-size: 26px;
    line-height: 1;
    margin: 0 0 20px 0;
    text-align: center;
  }

  .login > input {
    font-family: 'DB-Helvethaica-X', 'Kanit', sans-serif;
    border-radius: 5px;
    font-size: 20px;
    background: white;
    color: black;
    width: 80%;
    border: 1px solid #ffd1fe;
    padding: 10px 10px;
    margin: 15px 0;
  }
  .login > input#userid {
    margin-top: 15px;
  }
  .login > input#password {
    margin-bottom: 15px;
  }

  .login > button {
    font-family: 'DB-Helvethaica-X', 'Kanit', sans-serif;
    cursor: pointer;
    color: #fff;
    font-size: 18px;
    text-transform: uppercase;
    width: max-content;
    border: 0;
    padding: 10px 20px;
    margin: 20px 0 0 0;
    border-radius: 5px;
    background-color: #d66f01ff;
    transition: background-color 300ms;
  }
  .login > button:hover {
    background-color: #edb314ff;
  }
.login button {
  background: linear-gradient(135deg, #0f309bff, #1f2da6ff);
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}
.login button:hover {
  background: linear-gradient(135deg, #0f144aff, #190c7cff);


}
  .login button:hover {
  filter: brightness(1.1);
}

.login button {
  background: linear-gradient(135deg, #1b135eff, #0f189bff);
  transition: all 0.25s ease;
}

.login button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}
  @media screen and (max-width: 560px) {
    .login {
        width: 80vw;
        padding: 40px 30px 30px 30px;
    }
  }

  @keyframes wawes {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #13185eff, #531fa6ff, #0F9B0F);
}

.login-card {
  width: 480px;
  padding: 60px 50px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  box-shadow:
    0 40px 80px rgba(0, 0, 0, 0.25),
    0 10px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
}
  .login-card:hover {
  transform: translateY(-6px);
  transition: 0.3s ease;
}
.login-card {
  position: relative;
}

.login-card::before {
  content: "";
  position: absolute;
  inset: -3px;
  background: linear-gradient(135deg, #261fa6ff, #0f189bff);
  z-index: -1;
  border-radius: 24px;
  filter: blur(20px);
  opacity: 0.4;
}

.login h1 {
 font-size: 25px;
  font-weight: 700;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 30px;
  line-height: 1.4;
color:black;
background: linear-gradient(
    90deg,
    #161d65ff 25%,
    #0f0d79ff 50%,
    #1f1665ff 75%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

}
.login h1:hover {
  animation: shine 2s linear;
}
.login input {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  font-size: 16px;
  transition: all 0.25s ease;
}

.login input:focus {
  border-color: #1d16a3ff;
  box-shadow: 0 0 0 4px rgba(22, 55, 163, 0.15);
  outline: none;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header .icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #fef3c7; /* yellow-100 */
  color: #d97706;      /* yellow-600 */
  margin-bottom: 12px;
}

.login-header h1 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: #1f2937; /* gray-800 */
}

.login-header p {
  margin-top: 4px;
  font-size: 0.85rem;
  color: #6b7280; /* gray-500 */
}
`;