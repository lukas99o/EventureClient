import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { API_BASE_URL } from "../config";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userName , setUserName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_BASE_URL}/ping`)
            .then(() => console.log("✅ API wake-up request sent"))
            .catch(err => console.error("❌ API not reachable", err));
    }, []);

    function validateEmail(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password: string) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
    }

    function validateDateOfBirth(date: string) {
        const today = new Date();
        const birthDate = new Date(date);
        return birthDate <= today;
    }

    async function getRegistrationErrorMessage(res: Response) {
        const errorText = await res.text();

        if (errorText.includes("The username is already taken.") || errorText.includes("DuplicateUserName")) {
            return "That username is already taken.";
        }

        if (errorText.includes("The email address is already in use.") || errorText.includes("DuplicateEmail")) {
            return "That email address is already in use.";
        }

        try {
            const errorJson = JSON.parse(errorText) as { message?: string; errors?: string[] };

            if (errorJson.errors?.some(error => error.includes("DuplicateUserName"))) {
                return "That username is already taken.";
            }

            if (errorJson.errors?.some(error => error.includes("DuplicateEmail"))) {
                return "That email address is already in use.";
            }

            if (errorJson.message) {
                return errorJson.message;
            }
        } catch {
            // Fall through to the generic message below.
        }

        return "Something went wrong. Please try again.";
    }

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        const errors: string[] = [];

        if (!validateEmail(email)) {
            errors.push("Invalid email address");
        }

        if (!validatePassword(password)) {
            errors.push("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character");
        }

        if (!validateDateOfBirth(dateOfBirth)) {
            errors.push("Invalid date of birth");
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (errors.length > 0) {
            setError(errors.join(". "));
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email, 
                    password,
                    userName,
                    firstName,
                    lastName,
                    dateOfBirth: dateOfBirth
                })
            });

            if (!res.ok) {
                setError(await getRegistrationErrorMessage(res));
                return;
            }

            console.log("Registration successful");
            navigate("/verificationPage", { state: { email: email}});
        } catch {
            setError("Something went wrong.")
        }
    }

    return (
        <div className="d-flex justify-content-center container pb-5" style={{ height: "fit-content" }}>
            <form onSubmit={handleRegister} className="p-4 rounded shadow bg-white" style={{ width: "400px" }}>
                <h1 className="mb-4 text-center header">Sign up</h1>
                <p className="fs-6 border p-2 text-center">It can take up to 1 minute for Azure to warm up the Eventure API when the app has been in standby. Grab a coffee and try again shortly.</p>
                <div className="mb-3">
                    <label className="form-label" htmlFor="firstName">First name</label>
                    <input
                        id="firstName"
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        maxLength={50}
                        autoComplete="given-name"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="lastName">Last name</label>
                    <input
                        id="lastName"
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        maxLength={50}
                        autoComplete="family-name"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="userName">Username</label>
                    <input
                        id="userName"
                        type="text"
                        className="form-control"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                        maxLength={12}
                        autoComplete="username"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="dateOfBirth">Date of birth</label>
                    <input
                        id="dateOfBirth"
                        type="date"
                        className="form-control"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                        required
                        autoComplete="bday"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="registerEmail">Email</label>
                    <input
                        id="registerEmail"
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="registerPassword">Password</label>
                    <input
                        id="registerPassword"
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </div>

                {error && <div className="alert alert-danger py-1" role="alert">{error}</div>}

                <button type="submit" className="btn-orange w-100">Sign up</button>

                <div className="text-center mt-3">
                    <span>Already have an account? </span>
                    <Link to="/login">Log in</Link>
                </div>
            </form>
        </div>
    )
}