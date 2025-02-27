import React, {useState} from "react";
import logo from "../../assets/images/MigraCode-16.png";
import "./index.scss";
import LoginButton from "./LoginButton";
import { Link } from "react-router-dom";
import { resetProjectsState } from "../../redux/projects";
import { useDispatch } from "react-redux";


const Navbar = () => {
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleResetData = () => {
    dispatch(resetProjectsState());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isMobileMenuOpen ? "mobile-menu-open" : ""}`}>
      <div className="logo-name">
        <Link to="/">
          <img
            src="https://www.gitbook.com/cdn-cgi/image/width=256,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F666230843-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-legacy-files%2Fo%2Fspaces%252F-MRebciU3NcuLgsX3ijf%252Favatar-rectangle-1612180869136.png%3Fgeneration%3D1612180869680419%26alt%3Dmedia"
            alt="Logo"
          />
          {/* <div className="header-name">MigraCode Portfolio</div> */}
        </Link>
      </div>

      <div className={`nav ${isMobileMenuOpen ? "mobile-menu" : ""}`}>
        <Link to="/" className="nav-link" onClick={toggleMobileMenu}>
          Home
        </Link>
        <Link
          to="/projects"
          className="nav-link"
          onClick={() => {
            handleResetData();
            toggleMobileMenu();
          }}
        >
          Projects
        </Link>
        <Link to="/students" className="nav-link" onClick={handleResetData}>
          Students & Graduates
        </Link>
        <a
          href="https://migracode.openculturalcenter.org/"
          target="_blank"
          rel="noreferrer noopener"
          className="nav-link"
        >
          Official website
        </a>
        <Link to="/aboutus" className="nav-link">
          About us
        </Link>
      </div>

      <div className="burger-icon" onClick={toggleMobileMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
        <LoginButton />
    </nav>
  );
};

export default Navbar;

