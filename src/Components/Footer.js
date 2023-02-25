import { NavLink } from "react-router-dom";
const Footer = (props) => {
  return (
    <div className="footer">
      <div className="footer-contact">
        <p>theTalkSpace &copy;2023</p>
        <p className="footer-email">toby.productive@gmail.com</p>
        <p>Austin, TX & Perth, Australia</p>
        <p>LinkedIn</p>
      </div>
      <div className="footer-about">
        <p>Link to about page</p>
        <p>Link to FAQ</p>
        <p>
          <a
            style={{ color: "rgba(255,255,255,.7)", textDecoration: "none" }}
            href="https://github.com/TobyVB/Talkspace"
          >
            GitHub
          </a>
        </p>
        <NavLink to="profile">
          <p style={{ color: "rgba(255,255,255,.7)" }}>Profiles</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Footer;
