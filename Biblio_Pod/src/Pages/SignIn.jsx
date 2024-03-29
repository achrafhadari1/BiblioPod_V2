import React, { useState, useEffect } from "react";
import "../components/style/sign.css";

import { AuthProvider, useAuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { BiLogoGmail } from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Link } from "react-router-dom";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginError } = useAuthContext();
  const HandleLogin = async (e) => {
    e.preventDefault();
    login({ email, password });
  };
  return (
    <div className="login-outer-container w-full bg-black flex h-screen">
      <div className="h-full w-6/12 bg-black flex-factor "></div>
      <div className="h-full w-full bg-white  flex">
        <div className="flex w-full absolute items-center gap-4 p-4 justify-end">
          <div>Create a new Account?</div>
          <Link to="/signup">
            <Button variant={"outline"}>Let's Go</Button>
          </Link>
        </div>
        <Card className="w-[350px] card-size">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              {loginError ? (
                <span className="text-red-700">{loginError}</span>
              ) : (
                <span>Hello, Who's here?</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={HandleLogin}>
              <div className="flex gap-8 pb-4">
                <Button>
                  <BiLogoGmail className="mr-2 h-4 w-4" /> Login with Gmail
                </Button>
                <Button>
                  <BsTwitterX className="mr-2 h-4 w-4" /> Login with Twitter
                </Button>
              </div>

              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label type="email" htmlFor="name">
                    Email
                  </Label>

                  <Input
                    style={{
                      border: loginError ? "1px solid #EF4444" : "",
                    }}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    id="name"
                    placeholder="your@mail.com"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Password</Label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link to="">
              <div>Forgot Password?</div>
            </Link>

            <Button onClick={HandleLogin}>login</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
