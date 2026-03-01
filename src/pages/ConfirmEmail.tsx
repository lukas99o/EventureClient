import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const userId = searchParams.get("userId");
        const token = searchParams.get("token");

        if (!userId || !token) {
            setStatus("error");
            return;
        }

        fetch(`${API_BASE_URL}/api/auth/confirm-email?userId=${userId}&token=${encodeURIComponent(token)}`, {
            method: "POST"
        })
            .then(res => {
                if (res.ok) setStatus("success");
                else setStatus("error");
            })
            .catch(() => setStatus("error"));
    }, [searchParams]);

    return (
        <div className="d-flex justify-content-center container" style={{ height: "fit-content" }}>
            <div className="text-center p-4 rounded shadow bg-white">
                {status === "loading" && <p>Verifying email address...</p>}
                {status === "success" && <h1 className="header">Welcome to Eventure!</h1>}
                {status === "success" && <p className="text-black">Your email address has been confirmed. You can now log in.</p>}
                {status === "success" && <a href="/login" className="btn btn-orange mt-3 text-white">Log in</a>}
                {status === "error" && <h1 className="text-danger">Oops, something went wrong!</h1>}
                {status === "error" && <p className="text-danger">Verification failed. The link may be invalid or expired.</p>}
            </div>
        </div>
    );
}