import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { API_BASE_URL } from "../config";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [needsVerification, setNeedsVerification] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/ping`)
            .then(() => console.log("✅ API wake-up request sent"))
            .catch(err => console.error("❌ API not reachable", err));
    }, []);

    async function handleLogin(e: React.FormEvent, guest = false) {
        e.preventDefault();
        setError("");

        let loginEmail = email;
        let loginPassword = password;

        if (guest) {
            loginEmail = "iamtest@test.com";
            loginPassword = "Test123!";
        }
 
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                if (errorText === "You must confirm your email first.") {
                    setError("You need to confirm your email first.");
                    setNeedsVerification(true);
                } else {
                    setError("Incorrect email or password.");
                    setNeedsVerification(false);
                }

                return;
            }

            const data = await res.json();
            login(data.token, data.username, data.userId);
            navigate("/events");
        } catch {
            setError("Something went wrong.");
        }
    }

    return (
        <div className="container d-flex justify-content-center pb-5" style={{ height: "fit-content" }}>
            <form onSubmit={handleLogin} className="p-4 rounded shadow bg-white" style={{ width: "400px" }}>
                <h1 className="mb-4 text-center header">Log in</h1>
                <p className="fs-6 border p-2 text-center">It can take up to 1 minute for Azure to warm up the Eventure API when the app has been in standby. Grab a coffee and try again shortly.</p>
                <div className="mb-3">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form-control"
                        placeholder="name@email.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div className="input-group">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(p => !p)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>


                {error && <div className="alert alert-danger py-1" role="alert">{error}</div>}

                {needsVerification && (
                    <div className="mb-3">
                        <button
                            type="button"
                            className="btn btn-warning w-100"
                            onClick={async () => {
                                if (!email) {
                                    setResendMessage("Please enter your email address first.");
                                    return;
                                }
                                try {
                                    const res = await fetch(`${API_BASE_URL}/api/auth/resend-email?email=${encodeURIComponent(email)}`, {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" }
                                    });
                                    const message = await res.text();
                                    setResendMessage(message);
                                } catch {
                                    setResendMessage("Failed to resend email. Please try again.");
                                }
                            }}
                        >
                            Resend verification email
                        </button>
                        {resendMessage && <p className="text-muted mt-2 mb-0 small">{resendMessage}</p>}
                    </div>
                )}

                    <button type="submit" className="btn-orange w-100" >Log in</button>

                <div className="text-center mt-3">
                    <span>Don't have an account? </span>
                    <Link to="/register">Sign up</Link>
                    <p className="fs-6 mb-0">Log in as <button type="button" className="btn btn-link p-0 align-baseline" onClick={(e) => handleLogin(e, true)}>guest</button></p>
                </div>
            </form>
        </div>
    );
}