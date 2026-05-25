import { Link } from "react-router-dom";

export default function StartPage() {
    return (
        <div
            className="d-flex flex-column align-items-center pb-5 px-3"
            style={{ fontFamily: "'Nunito', sans-serif" }}
        >
            <h1 className="fancy-title mb-4 text-center">Welcome to Eventure!</h1>

            <div
                className="container rounded bg-light p-4 shadow d-flex flex-column flex-md-row align-items-center gap-4"
                style={{ overflow: "hidden" }} 
            >
                <div
                    className="position-relative w-100 w-md-50"
                    style={{
                        maxHeight: "400px", 
                        flex: "1 1 50%", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <video
                        src="/videos/flöde.mp4"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        aria-label="Decorative background video showing social activities"
                        style={{
                            width: "100%",
                            height: "100%",
                            maxHeight: "400px",
                            objectFit: "cover",
                            pointerEvents: "none",
                            filter: "brightness(0.85)",
                            borderRadius: "0.5rem"
                        }}
                    />
                </div>

                <div
                    className="w-90 w-md-50 text-center"
                    style={{ flex: "1 1 50%" }}
                >
                    <div
                        className="shadow startpage-text rounded p-4"
                        style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}
                    >
                        <h2 className="mb-3 header" style={{ fontWeight: "bold" }}>Explore Eventure</h2>
                        <p>Join our community and discover new connections!</p>
                        <p>We offer a platform to connect and build meaningful relationships.</p>
                        <p>Whether you're looking for friends, activities, or just want to have fun, we have something for you.</p>
                        <p>Sign up today and start your journey with Eventure!</p>
                        <Link className="btn btn-orange mt-2 mx-auto"
                           to="/register"
                           style={{ color: "white", width: "fit-content", padding: "10px 20px" }}
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
