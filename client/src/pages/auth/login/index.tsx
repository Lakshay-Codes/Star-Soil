import { Link, useNavigate } from "react-router-dom"
import { Input, Form, Button, App, message } from "antd"
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const onFinish = async (values: {
    email: string,
    password: string
  }) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", values);
      message.success("Login successful");
      Cookies.set("token", response.data.token);
      navigate("/");
    } catch (error: any) {
      message.error(error.response?.data?.message || error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/10 p-4">
      <Form 
        className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg"
        layout="vertical"
        onFinish={onFinish}
      >
        <h1 className="text-3xl font-bold text-primary text-center">
          Welcome Back
        </h1>
        <p className="text-gray-500 text-center text-sm">
          Please enter your credentials to login
        </p>
        <Form.Item 
          label="Email"
          name='email'
          rules={[
            {required: true, message: 'Email is required'},
            {type: 'email', message: 'Please enter a valid email'}
          ]}
        >
          <Input size="large" placeholder="Enter your email"/>
        </Form.Item>
        <Form.Item 
          label="Password"
          name='password'
          rules={[
            {required: true, message: 'Password is required'},
            {min: 6, message: 'Password must be at least 6 characters'}
          ]}
        >
          <Input.Password size="large" placeholder="Enter your password"/>
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            className="w-full"
          >
            Login
          </Button>
        </Form.Item>
        <div className="text-center text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:text-primary/80">
            Register
          </Link>
        </div>
      </Form>
    </div>
  );
}

function LoginPageWrapper() {
  return (
    <App>
      <LoginPage />
    </App>
  );
}

export default LoginPageWrapper;