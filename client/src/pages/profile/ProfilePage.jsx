import ProfileSummary from "../../components/profile/ProfileSummary";
import ProfileForm from "../../components/profile/ProfileForm";

function ProfilePage() {
  return (
    <div className="container section-tight">
      <div className="mb-5">
        <p className="eyebrow mb-2">Account</p>
        <h1 className="mb-1">Your profile</h1>
        <p className="text-muted-custom mb-0">
          Manage your photo, personal details, and password.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <ProfileSummary />
        </div>
        <div className="col-lg-8">
          <div className="surface p-4 p-md-5">
            <h4 className="mb-1">Account details</h4>
            <p className="text-small text-muted-custom mb-4">
              Your email address cannot be changed here.
            </p>
            <div style={{ maxWidth: 520 }}>
              <ProfileForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
