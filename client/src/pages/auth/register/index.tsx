import { Link, useNavigate } from "react-router-dom";
import { Input, Form, Button, message, App } from "antd";
import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      await axios.post(
        "/api/users/register",
        values
      );
      const response = await axios.post("/api/users/login", values);
      message.success("Login successful");
      Cookies.set("token", response.data.token);
      navigate("/");
    } catch (error: any) {
      message.error(error.response.data.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <App>
      <div className="min-h-screen flex items-center justify-center bg-primary/10 p-4">
        <Form
          className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg"
          layout="vertical"
          onFinish={onSubmit}
        >
          <h1 className="text-3xl font-bold text-primary text-center">
            Register Your Account
          </h1>
          <p className="text-gray-500 text-center text-sm">
            Please enter your details to register
          </p>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Full name is required" }]}
          >
            <Input size="large" placeholder="Enter your full name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input size="large" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password size="large" placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} type="primary" htmlType="submit" size="large" className="w-full">
              Register
            </Button>
          </Form.Item>
          <div className="text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80">
              Login
            </Link>
          </div>
        </Form>
      </div>
    </App>
  );
}

export default RegisterPage;
