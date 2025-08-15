import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartModal from '../pages/shop/CartModal';
import avatarImg from "../assets/avatar.png";
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { logout } from '../redux/features/auth/authSlice';
import logo from "../assets/LOGO_Bond Var1.png";

const Navbar = () => {
    // State management
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Redux and navigation
    const products = useSelector((state) => state.cart.products);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate();

    // Menu configurations
    const adminMenus = [
        { label: "Dashboard", path: "/dashboard/admin" },
        { label: "Manage Products", path: "/dashboard/manage-products" },
        { label: "Add Product", path: "/dashboard/add-product" },
    ];

    const userMenus = [
        { label: "Dashboard", path: "/dashboard" },
    ];

    const dropdownMenus = user?.role === 'admin' ? adminMenus : userMenus;
    const totalCartItems = products.reduce((total, item) => total + item.quantity, 0);

    // Handler functions
    const handleCartToggle = () => setIsCartOpen(!isCartOpen);
    const handleDropDownToggle = () => setIsDropDownOpen(!isDropDownOpen);
    const handleMobileMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="fixed w-full bg-white shadow-sm z-50">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24 relative">
                    
                    {/* Mobile menu button */}
                    <button
                        onClick={handleMobileMenuToggle}
                        className="sm:hidden text-gray-700 hover:text-[#d3ae27]"
                    >
                        <i className="ri-menu-line text-2xl"></i>
                    </button>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden sm:flex space-x-8 flex-1">
                        <div className="flex items-center space-x-8">
                            <NavLink to="/" text="Home" />
                            <NavLink to="/shop" text="Products" />
                            <NavLink to="/about" text="About" />
                        </div>
                    </nav>

                    {/* Logo - Centered */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Link to="/">
                            <img 
                                src={logo} 
                                alt="Company Logo" 
                                className="h-20 w-auto object-contain"
                                loading="lazy"
                            />
                        </Link>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-6 flex-1 justify-end">
                        <NavIcon 
                            icon="ri-search-line" 
                            to="/search" 
                            ariaLabel="Search"
                        />
                        
                        <button 
                            onClick={handleCartToggle}
                            className="relative hover:text-[#d3ae27]"
                            aria-label="Cart"
                        >
                            <i className="ri-shopping-bag-line text-xl"></i>
                            {totalCartItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#d3ae27] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalCartItems}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <UserDropdown 
                                user={user} 
                                avatarImg={avatarImg}
                                isOpen={isDropDownOpen}
                                menus={dropdownMenus}
                                onToggle={handleDropDownToggle}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <NavIcon 
                                icon="ri-user-line" 
                                to="/login" 
                                ariaLabel="Login"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <MobileMenu onClose={closeMobileMenu} user={user} />
            )}

            {/* Cart Modal */}
            {isCartOpen && (
                <CartModal 
                    products={products} 
                    isOpen={isCartOpen} 
                    onClose={handleCartToggle} 
                />
            )}
        </header>
    );
};

// Reusable components
const NavLink = ({ to, text }) => (
    <Link 
        to={to} 
        className="text-lg font-medium hover:text-[#d3ae27] transition-colors duration-300"
    >
        {text}
    </Link>
);

const NavIcon = ({ icon, to, ariaLabel }) => (
    <Link 
        to={to} 
        className="hover:text-[#d3ae27] transition-colors duration-300"
        aria-label={ariaLabel}
    >
        <i className={`${icon} text-xl`}></i>
    </Link>
);

const UserDropdown = ({ user, avatarImg, isOpen, menus, onToggle, onLogout }) => (
    <div className="relative">
        <button onClick={onToggle} aria-label="User menu">
            <img
                src={user?.profileImage || avatarImg}
                alt="User avatar"
                className="w-8 h-8 rounded-full cursor-pointer"
            />
        </button>
        
        {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                {menus.map((menu, index) => (
                    <Link
                        key={index}
                        to={menu.path}
                        onClick={() => onToggle(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        {menu.label}
                    </Link>
                ))}
                <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    Logout
                </button>
            </div>
        )}
    </div>
);

const MobileMenu = ({ onClose, user }) => (
    <div className="sm:hidden absolute top-24 left-0 right-0 bg-white shadow-lg z-40">
        <div className="px-2 pt-2 pb-4 space-y-2">
            <MobileLink to="/" text="Home" onClick={onClose} />
            <MobileLink to="/shop" text="Products" onClick={onClose} />
            <MobileLink to="/about" text="About" onClick={onClose} />
            <MobileLink to="/search" text="Search" icon="ri-search-line" onClick={onClose} />
            {!user && <MobileLink to="/login" text="Login" icon="ri-user-line" onClick={onClose} />}
        </div>
    </div>
);

const MobileLink = ({ to, text, icon, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
    >
        {icon && <i className={`${icon} mr-2`}></i>}
        {text}
    </Link>
);

export default Navbar;