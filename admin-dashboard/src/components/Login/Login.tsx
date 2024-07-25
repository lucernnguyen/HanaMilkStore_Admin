import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import '../Login/Login.css';
import userService from "../api/userService";

const Login: React.FC = () => {
  const [ph, setPh] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await userService.getUserByFilter(ph);
      if (response && response.length > 0) {
        const user = response[0];
        let expectedPassword = '';
        if (user.roleId === 1) {
          expectedPassword = '1111';
        } else if (user.roleId === 2) {
          expectedPassword = '2222';
        } else {
          toast.error("Không có quyền truy cập");
          setLoading(false);
          return;
        }
  
        if (password === expectedPassword) {
          sessionStorage.setItem('user', JSON.stringify(user));
          toast.success("Đăng nhập thành công");
          navigate('/');  // Navigate to the desired route
        } else {
          toast.error("Password không đúng");
        }
      } else {
        toast.error("Số điện thoại không đúng");
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const phoneValid = ph.length > 0 && /^\+\d{1,3}\d{10}$/.test("+" + ph);
  const canSubmit = phoneValid && password;

  return (
    <div className="login-body">
      <section className="login-section">
        <div className="login-row">
          <div className="logoLogin">
            <header>
              <a href="\" onClick={() => sessionStorage.removeItem('isLoggedIn')}>
                <img src="https://firebasestorage.googleapis.com/v0/b/imageuploadv3.appspot.com/o/Logo%20Footer%2Fdep2.png?alt=media&token=08b080e1-c883-4c89-ba4f-76f8f0a57b00" width="150" height="150" alt="Logo" />
              </a>
            </header>
          </div>
          <div>
            <Toaster toastOptions={{ duration: 2000 }} />
            <div className="w-1 flex flex-col gap-4 rounded-lg p-4 bg-white">
              <h1 className="text-center leading-normal text-black font-medium text-3xl mb-6">
                Hana Store
              </h1>
              <h1 className="text-center leading-normal text-black font-medium text-3x3 mb-1">
                Đăng nhập 
              </h1>
              <PhoneInput
                country={"vn"}
                value={ph || "+84"}
                onChange={setPh}
                containerClass="phone-input-custom"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />
              <button
                onClick={handleLogin}
                className={`btn-custom ${canSubmit ? 'accepted' : ''}`}
                disabled={!canSubmit || loading}
              >
                {loading && <span>Loading...</span>}
                <span>Đăng nhập</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
