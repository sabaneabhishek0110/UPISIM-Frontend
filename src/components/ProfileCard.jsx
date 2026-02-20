import useAuthStore from "../store/authStore";

const ProfileCard = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-red-500">User not logged in</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>

      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Name:</span> {user.name}</p>
        <p><span className="font-medium">Phone:</span> {user.phone}</p>
        <p><span className="font-medium">UPI ID:</span> {user.vpa}</p>
        <p><span className="font-medium">Bank:</span> {user.bank}</p>
        <p><span className="font-medium">Account:</span> {user.accountNumber || "-"}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
