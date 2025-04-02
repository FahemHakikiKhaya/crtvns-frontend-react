import api from "@/api/axiosConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/provider/AuthProvider";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.data.token;

      auth.login(token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth.token) {
      navigate("/");
    }
  }, [auth.token, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-[400px] flex flex-col space-y-4">
        <div className="space-y-2 text-center mb-5">
          <p className="text-xl font-bold">Welcome to TTS App</p>
          <p className="text-lg">Convert text to speech easily.</p>
        </div>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin}>Login to get started</Button>
      </div>
    </div>
  );
};

export default Login;
