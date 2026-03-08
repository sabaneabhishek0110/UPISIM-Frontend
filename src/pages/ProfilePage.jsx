import ProfileCard from "../components/ProfileCard";
import PageTransition from "../components/PageTransition";

const ProfilePage = () => {

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ color: "var(--color-text)" }}>
          Your Profile
        </h1>

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
