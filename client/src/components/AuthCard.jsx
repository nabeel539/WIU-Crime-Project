import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { adminLogin, userLogin, userSignup } from "@/services/apiServices";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "officer",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "officer",
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (loginData.role === "admin") {
        response = await adminLogin(
          loginData.email,
          loginData.password,
          loginData.role
        );
      } else {
        response = await userLogin(
          loginData.email,
          loginData.password,
          loginData.role
        );
      }
      alert(`${response.role} Login Successful`);
      console.log("Login successful:", response);
      if (response.role === "admin") navigate("/admin/dashboard");
      else navigate("/user/dashboard");
    } catch (error) {
      alert(error.message || "Login failed");
      console.error("Login error:", error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await userSignup(signupData);
      alert(response.message);
      console.log("Signup successful:", response);
      navigate("/user/dashboard");
    } catch (error) {
      alert(error.message || "Signup failed");
      console.error("Signup error:", error);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-600 to-purple-600 p-1 rounded-lg">
        <TabsTrigger
          value="login"
          className="data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg transition-colors duration-300"
        >
          Login
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className="data-[state=active]:bg-white data-[state=active]:text-purple-600 rounded-lg transition-colors duration-300"
        >
          Sign Up
        </TabsTrigger>
      </TabsList>

      {/* Login Tab */}
      <TabsContent value="login">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              Login
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLoginSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Select your role
                </Label>
                <RadioGroup
                  value={loginData.role}
                  onValueChange={(value) =>
                    setLoginData({ ...loginData, role: value })
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="admin"
                      id="admin"
                      className="text-blue-600"
                    />
                    <Label
                      htmlFor="admin"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Admin
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="officer"
                      id="ofs"
                      className="text-blue-600"
                    />
                    <Label
                      htmlFor="ofs"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Officer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="investigator"
                      id="Ins"
                      className="text-blue-600"
                    />
                    <Label
                      htmlFor="Ins"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Investigator
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300"
              >
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      {/* Sign Up Tab */}
      <TabsContent value="signup">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              Sign Up
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Create a new account to get started.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignupSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="mobile"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Mobile
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={signupData.mobile}
                  onChange={(e) =>
                    setSignupData({ ...signupData, mobile: e.target.value })
                  }
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Role
                </Label>
                <Select
                  value={signupData.role}
                  onValueChange={(value) =>
                    setSignupData({ ...signupData, role: value })
                  }
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700">
                    <SelectItem
                      value="officer"
                      className="hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Officer
                    </SelectItem>
                    <SelectItem
                      value="investigator"
                      className="hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Investigator
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CardFooter className="p-0 pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300"
                >
                  Sign Up
                </Button>
              </CardFooter>
            </CardContent>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
