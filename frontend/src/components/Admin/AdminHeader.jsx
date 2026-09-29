
import {
  Menu,
  Bell,
  RefreshCw,
} from "lucide-react";

import "./AdminHeader.css";

const AdminHeader = ({
  onMenuClick,
  title = "Dashboard",
  description = "Manage your MAMTA CIRCLE store.",
  onRefresh,
}) => {
  return (
    <header className="admin-header">

      <div className="admin-header-left">

        <button
          className="admin-menu-btn"
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <span className="admin-header-label">
            MAMTA CIRCLE ADMINISTRATION
          </span>

          <h1>{title}</h1>

          <p>{description}</p>
        </div>

      </div>


      <div className="admin-header-actions">

        <button
          className="admin-header-icon"
          type="button"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>

        <button
          className="admin-header-icon"
          type="button"
          onClick={onRefresh}
          aria-label="Refresh"
        >
          <RefreshCw size={18} />
        </button>

      </div>

    </header>
  );
};

export default AdminHeader;

