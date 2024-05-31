/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Box, Stack, FormControl, FormLabel, Input, Button, Typography } from "@mui/joy";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../lib/context/AuthContext";
import { UserRegisterPayload } from "../../../lib/context/types/Context";
import { BoxConfig, inputSx } from "./login";

export default function RegisterAuth() {
  const navigate = useNavigate();
  const [data, setData] = useState<UserRegisterPayload>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState<{ msg: string; bool: boolean }>();
  const { UserRegister } = useAuth();

  const handleRegister = () => {
    setIsLoading(true);
    UserRegister(data!)
      .then((res) => {
        setIsLoading(false);
        if (res.status) {
          setError({ bool: false, msg: "" });
          alert(res.message);
          navigate("/auth/login")
        } else {
          setError({ bool: !res.status, msg: res.message! });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setError({ bool: true, msg: err.message });
      });
  };

  const handleChange = (e: any) => {
    // @ts-expect-error waa
    const payload: UserRegisterPayload = {
      ...data,
      [e.target.name]: e.target.value,
    };
    setData(payload!);
  };

  return (
    <>
      <div className="container flex justify-center items-center h-screen">
        <div className="">
          <h1 className="px-5 md:p-0 text-2xl font-semibold"> Welcome to Cook Mini </h1>
          {isError?.bool && (<Alert variant="outlined" sx={{ borderColor: "#FB8C00", }}> {isError?.msg} </Alert>)}
          <Box
            sx={BoxConfig} >
            <Stack gap={4} sx={{ mt: 1 }}>
              <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} >
                <FormControl required>
                  <FormLabel>Name</FormLabel>
                  <Input variant="soft" sx={inputSx} onChange={handleChange} type="text" name="name" placeholder="Name" disabled={isLoading} />
                </FormControl>
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input variant="soft" sx={inputSx} onChange={handleChange} type="email" name="email" placeholder="Email" disabled={isLoading} />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input variant="soft" sx={inputSx} onChange={handleChange} type="password" name="password" placeholder="Password" disabled={isLoading} />
                </FormControl>
                <Stack gap={4} sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", }} >
                    <Button sx={{ backgroundColor: "#FB8C00", ":hover": { backgroundColor: "#ffa500", }, }} loading={isLoading} type="submit" fullWidth >Sign up</Button>
                  </Box>
                </Stack>
                <h1 className="px-5 md:p-0 text-center text-sm">
                  Already Registered ?{" "}
                  <Link className="text-orange-600" to="/auth/login">
                    Sign in!
                  </Link>
                </h1>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
              © Cook Mini {new Date().getFullYear()}
            </Typography>
          </Box>
        </div>
      </div>
    </>
  );
}
