import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate('/');

  return (
    <section>
      <h1>Unauthorized</h1>
      <br />
      <p>คุณไม่สามารถเข้าถึงเพจที่ร้องขอได้.</p>
      <div className="flexGrow">
        <button onClick={goBack}>กลับ</button>
      </div>
    </section>
  );
};

export default Unauthorized;