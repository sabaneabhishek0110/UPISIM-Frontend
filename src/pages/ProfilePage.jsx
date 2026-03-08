import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import PageTransition from "../components/PageTransition";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="mr-4 font-medium text-sm"
            style={{ color: "var(--color-accent)" }}
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Your Profile
          </h1>
        </div>

        <div className="flex justify-center">
          <ProfileCard />
        </div>

        <div className="mt-8 text-center text-sm max-w-md mx-auto" style={{ color: "var(--color-text-muted)" }}>
          Your profile information is securely fetched from your bank-linked UPI account.
          Editing is currently disabled for security reasons.
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
