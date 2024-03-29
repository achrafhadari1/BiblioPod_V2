import React, { useEffect, useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { NewNav } from "../components/NewNav";
import { AuthProvider, useAuthContext } from "../context/AuthContext";

export const Settings = () => {
  const { user, getUser } = useAuthContext();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!user) {
      getUser();
    } else {
      // Derive username from user email
      setUsername(user.email.split("@")[0]);
    }
  }, [user, getUser]);

  return (
    <>
      <NewNav />
      <div className="w-3/5 m-auto flex flex-col gap-12 ">
        <div className="text-4xl font-bold">Settings</div>
        {user && (
          <div className="px-4 space-y-6 md:px-6">
            <header className="space-y-1.5">
              <div className="flex items-center space-x-4">
                <img
                  alt="Avatar"
                  className="border rounded-full"
                  height="96"
                  src="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg"
                  style={{
                    aspectRatio: "96/96",
                    objectFit: "cover",
                  }}
                  width="96"
                />
                <div className="space-y-1.5">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    @{username}
                  </p>
                </div>
              </div>
            </header>
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      defaultValue={user.name}
                      id="name"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      defaultValue={user.email}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone"
                      type="tel"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Change Password</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      placeholder="Enter your current password"
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      placeholder="Enter your new password"
                      type="password"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      placeholder="Confirm your new password"
                      type="password"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button size="lg">Save</Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
