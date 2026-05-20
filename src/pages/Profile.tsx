import { useEffect, useState, useRef } from "react";
import { GetUser } from "../api/user/getUser";
import { uploadProfilePicture } from "../api/user/uploadProfilePicture";
import { deleteProfilePicture } from "../api/user/deleteProfilePicture";
import { API_BASE_URL } from "../config";
import { updateUserAbout } from "../api/user/updateUserAboot";
import type { UserDto } from "../types";

export default function Profile() {
    const [user, setUser] = useState<UserDto | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string>("");
    const [editingAbout, setEditingAbout] = useState(false);
    const [aboutText, setAboutText] = useState("");
    const [aboutError, setAboutError] = useState("");
    const [savingChanges, setSavingChanges] = useState(false);
    const userId = localStorage.getItem("userId") || "";
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        GetUser(userId).then(data => setUser(data));
    }, []);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [selectedFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSaveChanges = async () => {
        if (!user) return;

        const hasAboutChanges = editingAbout && aboutText.trim() !== (user.about ?? "").trim();

        if (hasAboutChanges && !aboutText.trim()) {
            setAboutError("You need to write something about yourself.");
            return;
        }

        setUploadError("");
        setAboutError("");
        setSavingChanges(true);

        let nextProfilePicturePath = user.profilePicturePath;
        let nextAbout = user.about;

        if (selectedFile) {
            const path = await uploadProfilePicture(selectedFile);
            if (!path) {
                setUploadError("Max 2MB. Only JPG, PNG, and JPEG are allowed.");
                setSavingChanges(false);
                return;
            }

            nextProfilePicturePath = path;
            setSelectedFile(null);
        }

        if (hasAboutChanges) {
            await updateUserAbout(aboutText);
            nextAbout = aboutText;
            setEditingAbout(false);
        }

        setUser(prev => prev ? { ...prev, profilePicturePath: nextProfilePicturePath, about: nextAbout } : prev);
        setSavingChanges(false);
    };

    const handleCancelChanges = () => {
        setSelectedFile(null);
        setUploadError("");
        setAboutError("");

        if (editingAbout) {
            setAboutText(user?.about ?? "");
            setEditingAbout(false);
        }
    };

    const handleProfilePicClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveProfilePic = async () => {
        if (!user || !window.confirm("Are you sure you want to remove your profile picture?")) return;
        setUploadError("");

        const success = await deleteProfilePicture();
        if (success) {
            setUser(prev => prev ? { ...prev, profilePicturePath: null } : prev);
            setSelectedFile(null);
        } else {
            setUploadError("Could not remove the picture.");
        }
    };

    if (!user) return <div>Loading...</div>;

    const hasPendingChanges =
        Boolean(selectedFile) ||
        (editingAbout && aboutText.trim() !== (user.about ?? "").trim());

    return (
        <div className="container d-flex justify-content-center profile-container pb-5">
            <div className="bg-white rounded-4 shadow p-4 container-header" style={{ maxWidth: 420, width: "100%" }}>
                <div className="d-flex flex-column align-items-center mb-4">
                    <div
                        style={{ position: "relative", cursor: "pointer" }}
                        onClick={handleProfilePicClick}
                        onMouseEnter={e => e.currentTarget.classList.add("profile-pic-hover")}
                        onMouseLeave={e => e.currentTarget.classList.remove("profile-pic-hover")}
                    >
                        {(previewUrl || user.profilePicturePath) ? (
                            <img
                                src={previewUrl ?? `${API_BASE_URL}${user.profilePicturePath}`}
                                alt="Profile picture"
                                className="rounded-circle border border-3 border-warning mb-3"
                                style={{ width: 120, height: 120, objectFit: "cover", transition: "filter 0.2s" }}
                            />
                        ) : (
                            <div 
                                className="rounded-circle border border-3 border-warning mb-3 d-flex flex-column align-items-center justify-content-center"
                                style={{
                                    width: 120,
                                    height: 120,
                                    backgroundColor: "#fff9e6",
                                    borderStyle: "dashed",
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = "#ffe4b3";
                                    e.currentTarget.style.transform = "scale(1.05)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = "#fff9e6";
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                            >
                                <i className="bi bi-camera-fill text-warning mb-2" style={{ fontSize: "2rem" }}></i>
                                <span className="text-warning fw-bold" style={{ fontSize: "0.75rem" }}>Click to</span>
                                <span className="text-warning fw-bold" style={{ fontSize: "0.75rem" }}>upload</span>
                            </div>
                        )}
                        <input
                            type="file"
                            className="d-none"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        {user.profilePicturePath && (
                            <span
                                className="profile-pic-hover-icon"
                                style={{
                                    display: "none",
                                    position: "absolute",
                                    bottom: 10,
                                    right: 10,
                                    background: "#ffc107",
                                    borderRadius: "50%",
                                    padding: "6px",
                                    border: "2px solid #fff",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
                                }}
                            >
                                <i className="bi bi-camera-fill text-white"></i>
                            </span>
                        )}
                    </div>
                    {user.profilePicturePath && !selectedFile && (
                        <div className="w-100 text-center mt-2 mb-3">
                            <button
                                className="btn-orange"
                                onClick={handleRemoveProfilePic}
                            >
                                Remove profile picture
                            </button>
                            {uploadError && <div className="text-danger mt-2">{uploadError}</div>}
                        </div>
                    )}
                    <h2 className="fw-bold text-orange mb-1 mt-3">{user.userName}</h2>
                    <span className="text-muted">{user.firstName} {user.lastName}, {user.age} years</span>
                </div>
                <div className="mb-3">
                    <h5 className="fw-bold text-orange mb-2">About me</h5>
                    <div className="bg-light rounded p-3">
                        {editingAbout ? (
                            <div>
                                <textarea
                                    className="form-control mb-2"
                                    rows={3}
                                    value={aboutText}
                                    onChange={e => setAboutText(e.target.value)}
                                    placeholder="Write something about yourself..."
                                    maxLength={150}
                                />
                                {aboutError && <div className="text-danger mt-2">{aboutError}</div>}
                            </div>
                        ) : user.about && user.about.trim() !== "" ? (
                            <div className="d-flex flex-column gap-2">
                                <p
                                    className="mb-0 border p-2 shadow-sm rounded"
                                    style={{
                                        wordBreak: "break-word",
                                        maxHeight: "30vh",
                                        minHeight: 60,
                                        overflowY: "auto"
                                    }}
                                >
                                    {user.about}
                                </p>
                                <button className="btn btn-outline-secondary" onClick={() => { setEditingAbout(true); setAboutText(user.about ? user.about : ""); }}>Edit</button>
                            </div>
                        ) : (
                            <button
                                className="btn-orange"
                                onClick={() => { setEditingAbout(true); setAboutText(""); }}
                            >
                                Write about yourself
                            </button>
                        )}
                    </div>
                </div>
                {hasPendingChanges && (
                    <div className="mt-3">
                        <button
                            className="btn w-100 text-white border-0"
                            style={{ backgroundColor: "#55cde7" }}
                            onClick={handleSaveChanges}
                            disabled={savingChanges}
                        >
                            {savingChanges ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            className="btn btn-outline-secondary w-100 mt-2"
                            onClick={handleCancelChanges}
                            disabled={savingChanges}
                        >
                            Cancel
                        </button>
                        {uploadError && <div className="text-danger mt-2">{uploadError}</div>}
                        {aboutError && <div className="text-danger mt-2">{aboutError}</div>}
                    </div>
                )}
            </div>
        </div>
    );
}
