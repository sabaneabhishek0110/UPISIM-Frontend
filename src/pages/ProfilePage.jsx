import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">

      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="mr-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800">
          Your Profile
        </h1>
      </div>

      {/* Profile Card */}
      <div className="flex justify-center">
        <ProfileCard />
      </div>

      {/* Info Section */}
      <div className="mt-8 text-center text-sm text-gray-500 max-w-md mx-auto">
        Your profile information is securely fetched from your bank-linked UPI account.
        Editing is currently disabled for security reasons.
      </div>

    </div>
  );
};

export default ProfilePage;
