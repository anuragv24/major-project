import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [regStep, setRegStep] = useState("details");
  const [forgotStep, setForgotStep] = useState("request"); // 'request', 'otp', 'reset'
  const otpInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    otp: "",
    bio: "",
  });

  const { login, sendOtp, verifyOtp, resetPassword } = useContext(AuthContext);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currentState === "Sign up") {
      if (regStep === "details") {
        const success = await sendOtp(formData.email, "registration");
        if(success)
          setRegStep("otp");
      } else if (regStep === "otp") {
        const success = await verifyOtp(formData.email, formData.otp, "registration");
        if(success)
          setRegStep("bio");
      } else {
        // final registeration
        login("signup", formData);
      }
    } else if (currentState === "Login") {
      login("login", formData);
    } else if(currentState === "Forgot Password") {
      if(forgotStep === "request") {
        const success = await sendOtp(formData.email, "reset");
        if(success)
          setForgotStep("otp");
      } else if(forgotStep === "otp") {
        setForgotStep("reset");
      } else {
        const success = await resetPassword(formData.email, formData.otp, formData.password);
        if(success)
          setCurrentState("Login");
      }
    }
  };

  useEffect(() => {
    if (regStep === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [regStep]);

  const steps = ["details", "otp", "bio"];

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      {/* <img src={assets.logo_big} alt="" className="w-[min(30vw, 250px)]" /> */}

      <div className="absolute w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -top-10 -left-10"></div>
      <div className="absolute w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -bottom-10 -right-10"></div>

      <form
        onSubmit={onSubmitHandler}
        className="relative z-10 w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl flex flex-col gap-5"
      >
        {currentState === "Sign up" && (
          <div className="flex justify-center gap-3 mb-2">
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  steps.indexOf(regStep) >= index ? "w-8 bg-indigo-500" : "w-4 bg-slate-700"
                }`}
              />
            ))}
          </div>
        )}

        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold text-white">{currentState}</h2>
        </div>


        {/* --- LOGIN / SIGNUP DETAILS --- */}
        {(currentState === "Login" ||
          (currentState === "Sign up" && regStep === "details")) && (
          <div className="flex flex-col gap-4">
            {currentState === "Sign up" && (
              <>
                <input
                  name="fullName"
                  onChange={handleChange}
                  value={formData.fullName}
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <input
                  name="username"
                  onChange={handleChange}
                  value={formData.username}
                  type="text"
                  placeholder="Username"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </>
            )}
            <input
              name="email"
              onChange={handleChange}
              value={formData.email}
              type="email"
              placeholder="Email or Username"
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />

              <input
                name="password"
                onChange={handleChange}
                value={formData.password}
                type="password"
                placeholder="Password"
                required
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
          </div>
        )}

        {/* --- OTP STEP --- */}
        {currentState === "Sign up" && regStep === "otp" && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-500">
            <p className="text-xs text-indigo-400 text-center">
              Enter the 6-digit code sent to your email
            </p>
            <input
              name="otp"
              onChange={handleChange}
              value={formData.otp}
              type="text"
              placeholder="Enter OTP"
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-center text-xl tracking-[1em]"
              maxLength={6}
            />
          </div>
        )}

        {/* --- BIO STEP --- */}
        {currentState === "Sign up" && regStep === "bio" && (
          <div className="flex flex-col gap-4 animate-in slide-in-from-right duration-500">
            <textarea
              name="bio"
              rows={4}
              onChange={handleChange}
              value={formData.bio}
              placeholder="Tell us about yourself..."
              required
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            ></textarea>
          </div>
        )}

        {currentState === "Forgot Password" && (
  <div className="flex flex-col gap-4 animate-in fade-in duration-300">
    
    {/* STEP 1: Email Input */}
    {forgotStep === "request" && (
      <>
        <p className="text-sm text-slate-400 text-center">Enter your email to receive a password reset code.</p>
        <input 
          name="email" 
          onChange={handleChange} 
          value={formData.email} 
          type="email" 
          placeholder="Email Address" 
          required 
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
        />
      </>
    )}

    {/* STEP 2: OTP Input */}
    {forgotStep === "otp" && (
      <>
        <p className="text-sm text-indigo-400 text-center">Check your inbox for the reset code.</p>
        <input 
          name="otp" 
          onChange={handleChange} 
          value={formData.otp} 
          type="text" 
          placeholder="6-Digit OTP" 
          required 
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-center tracking-widest" 
          maxLength={6} 
        />
      </>
    )}

    {/* STEP 3: New Password Input */}
    {forgotStep === "reset" && (
      <>
        <p className="text-sm text-green-400 text-center">OTP Verified! Set your new password.</p>
        <input 
          name="password" 
          onChange={handleChange} 
          value={formData.password} 
          type="password" 
          placeholder="New Password" 
          required 
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
        />
        <input 
          type="password" 
          placeholder="Confirm New Password" 
          required 
          className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
        />
      </>
    )}
  </div>
)}

        <button
          type="submit"
          className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          {currentState === "Login"
            ? "Sign In"
            : currentState === "Forgot Password"
              ? "Send Reset Link"
              : regStep === "details"
                ? "Register"
                : regStep === "otp"
                  ? "Verify OTP"
                  : "Complete Profile"}
        </button>

        {/* --- NAVIGATION FOOTER --- */}
        <div className="text-center text-sm space-y-3">
          {currentState === "Login" && (
            <p
              className="text-indigo-400 cursor-pointer hover:underline"
              onClick={() => setCurrentState("Forgot Password")}
            >
              Forgot Password?
            </p>
          )}

          <p className="text-slate-400">
            {currentState === "Sign up"
              ? "Already have an account?"
              : "Don't have an account?"}
            <span
              onClick={() => {
                setCurrentState(
                  currentState === "Sign up" ? "Login" : "Sign up",
                );
                setRegStep("details");
              }}
              className="ml-2 text-indigo-400 font-medium cursor-pointer hover:text-indigo-300"
            >
              {currentState === "Sign up" ? "Login here" : "Create one"}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
