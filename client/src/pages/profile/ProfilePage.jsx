import ProfileForm from "../../components/profile/ProfileForm";

function ProfilePage() {
  return (
    <div className="container section-tight">
      <div
        className="surface"
        style={{ maxWidth: 520, padding: "var(--space-5)" }}
      >
        <p className="eyebrow mb-2">Account</p>
        <h2 className="mb-4">Your profile</h2>
        <ProfileForm />
      </div>
    </div>
  );
}

export default ProfilePage;
