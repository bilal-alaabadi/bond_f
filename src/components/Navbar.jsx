// src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  ShoppingBag,
  Menu,
  X as CloseIcon,
  User,
} from "lucide-react";
import CartModal from "../pages/shop/CartModal";
import avatarImg from "../assets/avatar.png";
import logo from "../assets/LOGO_Bond Var1.png";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { logout } from "../redux/features/auth/authSlice";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user } = useSelector((s) => s.auth);
  const products = useSelector((s) => s.cart.products);
  const totalCartItems = products.reduce((t, i) => t + i.quantity, 0);

  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      setMobileOpen(false);
      navigate("/");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-[72px] items-center">
          {/* زر القائمة في الموبايل */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden mr-3 text-[#0E161B] hover:opacity-70 transition"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <CloseIcon size={26} strokeWidth={1.5} />
            ) : (
              <Menu size={26} strokeWidth={1.5} />
            )}
          </button>

          {/* روابط الديسكتوب */}
          <nav className="flex-1">
            <ul className="hidden md:flex items-center gap-10">
              <NavItem to="/" label="HOME" />
              <NavItem to="/shop" label="PRODUCTS" />
              <NavItem to="/about" label="ABOUT" />
            </ul>
          </nav>

          {/* الشعار */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" aria-label="Home">
              <img
                src={logo}
                alt="BOND"
                className="h-10 w-auto object-contain select-none"
                draggable="false"
              />
            </Link>
          </div>

          {/* أيقونات اليمين */}
          <div className="ml-auto flex items-center gap-6 text-[#0E161B]">
            <Link to="/search" aria-label="Search" className="hover:opacity-70 transition">
              <Search size={22} strokeWidth={1.5} />
            </Link>

            {/* 👤 يظهر فقط على md↑ */}
            <div className="hidden md:block">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropOpen((p) => !p)}
                    className="rounded-full"
                    aria-label="User Menu"
                  >
                    <img
                      src={user?.profileImage || avatarImg}
                      alt="Avatar"
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  </button>

                  {isDropOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                      {user?.role === "admin" ? (
                        <>
                          <DropItem to="/dashboard/admin">Dashboard</DropItem>
                          <DropItem to="/dashboard/manage-products">
                            Manage Products
                          </DropItem>
                          <DropItem to="/dashboard/add-product">
                            Add Product
                          </DropItem>
                        </>
                      ) : (
                        <DropItem to="/dashboard">Dashboard</DropItem>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" aria-label="Login" className="hover:opacity-70 transition">
                  <User size={22} strokeWidth={1.5} />
                </Link>
              )}
            </div>

            {/* 🛍️ السلة */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hover:opacity-70 transition"
              aria-label="Cart"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {totalCartItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0E161B] px-1 text-[10px] font-medium text-white">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الموبايل */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-[78%] max-w-xs transform bg-white shadow-xl transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-[72px] flex flex-col h-full">
          {/* روابط علوية */}
          <ul className="py-2 flex-1">
            <MobileItem to="/" onClick={() => setMobileOpen(false)}>
              Home
            </MobileItem>
            <MobileItem to="/shop" onClick={() => setMobileOpen(false)}>
              Products
            </MobileItem>
            <MobileItem to="/about" onClick={() => setMobileOpen(false)}>
              About
            </MobileItem>
          </ul>

          {/* أسفل القائمة */}
          <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
            {!user ? (
              // غير مسجل: زر الدخول فقط
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <User size={18} strokeWidth={1.5} />
                <span>Login</span>
              </Link>
            ) : (
              // مسجل: صورة البروفايل + روابط الحساب + تسجيل الخروج
              <>
                <div className="flex items-center gap-3">
                  <img
                    src={user?.profileImage || avatarImg}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium text-gray-800">
                    {user?.username || "My Account"}
                  </span>
                </div>

                {user?.role === "admin" ? (
                  <>
                    <MobileBottomLink to="/dashboard/admin" onClick={() => setMobileOpen(false)}>
                      Dashboard
                    </MobileBottomLink>

                  </>
                ) : (
                  <MobileBottomLink to="/dashboard" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </MobileBottomLink>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <User size={18} strokeWidth={1.5} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
        />
      )}

      {/* مودال السلة */}
      {isCartOpen && (
        <CartModal
          products={products}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </header>
  );
};

/* عناصر الروابط */
const NavItem = ({ to, label }) => (
  <li>
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        [
          "text-[14px] tracking-[0.16em] uppercase",
          "text-[#0E161B]",
          isActive
            ? "font-semibold underline underline-offset-[10px] decoration-2"
            : "hover:opacity-70",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  </li>
);

const MobileItem = ({ to, children, onClick }) => (
  <li>
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        [
          "block px-6 py-4 text-lg",
          "text-[#0E161B]",
          isActive ? "bg-gray-50 font-semibold" : "hover:bg-gray-50",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  </li>
);

const MobileBottomLink = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className="block px-1 py-2 text-sm text-gray-700 hover:underline"
  >
    {children}
  </NavLink>
);

const DropItem = ({ to, children }) => (
  <NavLink
    to={to}
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  >
    {children}
  </NavLink>
);

export default Navbar;
