"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Container,
  Link,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // Login Success
      localStorage.setItem("isAuthenticated", "true"); // Keep for simple client checks
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err) {
      setError("Failed to connect to server");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            background: "rgba(20, 20, 25, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
          }}
        >
          <CardContent
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                m: 1,
                bgcolor: "primary.main",
                borderRadius: "50%",
                p: 1.5,
                display: "flex",
                boxShadow: "0 4px 14px 0 rgba(124, 58, 237, 0.39)",
              }}
            >
              <LockOutlinedIcon sx={{ color: "white" }} />
            </Box>
            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 1, fontWeight: "bold" }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sign in to manage your expenses
            </Typography>

            <Box
              component="form"
              onSubmit={handleAuth}
              sx={{ mt: 1, width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem" }}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    variant="body2"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
                {/* <Link
                  href="/change-password"
                  variant="body2"
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Change Password?
                </Link> */}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
