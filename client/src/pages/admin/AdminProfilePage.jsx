import { useAuth } from "../../context/AuthContext";
import { ROLE_LABELS } from "../../utils/constants";
import ProfileForm from "../../components/profile/ProfileForm";
import Avatar from "../../components/Avatar";
function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <div className="mb-5">
        <p className="eyebrow mb-2">Account</p>
        <h1 className="mb-1">My profile</h1>
        <p className="text-muted-custom mb-0">
          Update your details and password.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="surface p-4 text-center">
            <Avatar
              name={user.name}
              src={user.avatar}
              size="lg"
              className="mx-auto mb-3"
            />
            <h4 className="mb-1">{user.name}</h4>
            <p className="text-small text-muted-custom mb-3">{user.email}</p>
            <span className={`badge-status badge-role-${user.role}`}>
              {ROLE_LABELS[user.role]}
            </span>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="surface p-4">
            <h4 className="mb-4">Account details</h4>
            <ProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfilePage;
