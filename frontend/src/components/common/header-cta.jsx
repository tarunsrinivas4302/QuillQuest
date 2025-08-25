
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { PenBox } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";

const HeaderCTA = () => {
  const { user, logout, isAuthenticated } = useAuthContext();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleDropdown = () => setOpen((prev) => !prev);
  const handleLogout = () => logout();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user || !isAuthenticated) {
    return (
      <Link
        to="/login"
        className="px-6 py-3 bg-black text-white font-medium rounded hover:opacity-90 transition cursor-pointer"
      >
        Login
      </Link>
    );
  }
  const userInitial = user?.username?.[0]?.toUpperCase() || "U";
  const profileImage = user?.profileImage?.url;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700 border border-gray-300 hover:shadow-sm"
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          userInitial
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="text-sm text-gray-700">
            <li>
              <Link to="/blogs/new" className=" px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
                <PenBox size={16} />
                Write
              </Link>
            </li>
            <li>
              <Link to="/profile/me" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
            </li>
            {/* <li>
              <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                Dashboard
              </Link>
            </li> */}
            {/* <li>
              <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">
                Settings
              </Link>
            </li> */}
            <li>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeaderCTA;
