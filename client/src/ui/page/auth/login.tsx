/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Box, Stack, FormControl, FormLabel, Input, Button, Typography } from "@mui/joy";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserLoginPayload } from "../../../lib/context/types/Context";
import { useAuth } from "../../../lib/context/AuthContext";

export const inputSx = { "&::before": { display: "none", }, "&:focus-within": { outline: "2px solid #FB8C00", outlineOffset: "2px", }, };
export const BoxConfig = { my: "auto", py: 2, pb: 5, display: "flex", flexDirection: "column", gap: 2, width: 300, maxWidth: "90%", mx: "auto", borderRadius: "sm", "& form": { display: "flex", flexDirection: "column", gap: 2, }, "@media (min-width: 768px)": { maxWidth: "100%", width: 400, }, }

export default function LoginAuth() {
  const [data, setData] = useState<UserLoginPayload>();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState<{ msg: string; bool: boolean }>();
  const { UserLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setIsLoading(true);
    const res = await UserLogin(data!);
    setIsLoading(false);
    if (res.status) {
      setError({ bool: false, msg: "" });
      navigate("/");
    } else alert(res.message);
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
    <div className="container flex justify-center items-center h-screen">
      <div className="md:w-[400px] w-[300px] space-y-1">
        <h1 className="px-5 md:p-0 text-2xl font-semibold">Welcome back to Cook Mini</h1>
        <p className="ml-5 md:ml-0 text-sm">
          Log in to your account to save recipes, get personalized
          recommendations, and more.
        </p>
        {isError?.bool && (<Alert variant="outlined" sx={{ borderColor: "#FB8C00" }}>{isError?.msg}</Alert>)}
        <Box sx={BoxConfig}>
          <Stack gap={4} sx={{ mt: 1 }}>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <FormControl required>
                <FormLabel>Email</FormLabel>
                <Input variant="soft" onChange={handleChange} sx={inputSx} type="email" name="email" placeholder="Email" disabled={isLoading} />
              </FormControl>
              <FormControl required>
                <FormLabel>Password</FormLabel>
                <Input variant="soft" onChange={handleChange} sx={inputSx} type="password" name="password" placeholder="Password" disabled={isLoading} />
              </FormControl>
              <Stack gap={2} sx={{ mt: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                  <Button loading={isLoading} sx={{ backgroundColor: "#FB8C00", ":hover": { backgroundColor: "#ffa500", }, }} type="submit" fullWidth> Sign in</Button>
                </Box>
              </Stack>
              <h1 className="px-5 md:p-0 text-center"> New to Cook Mini?{" "} <Link className="text-orange-600" to="/auth/register"> Sign up!</Link></h1>
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
  );
}
