
import { Link, useLocation } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

import "./EmailSent.css";

const EmailSent = () => {
  const location = useLocation();

  const email =
    location.state?.email ||
    "your email address";

  return (
    <main className="email-sent-page">

      <div className="email-sent-card">

        <div className="email-sent-icon">
          <Mail size={30} />
        </div>

        <span className="email-sent-label">
          CHECK YOUR INBOX
        </span>

        <h1>
          Verify your <em>email.</em>
        </h1>

        <p>
          We've sent a 6-digit verification code to
        </p>

        <strong className="email-sent-address">
          {email}
        </strong>

        <p className="email-sent-description">
          Enter the code from the email to activate
          your MAMTA account.
        </p>

        <div className="email-sent-note">
          The verification code expires in
          <strong> 24 hours.</strong>
        </div>

        <Link
          to="/verify-email"
          state={{ email }}
          className="email-sent-button"
        >
          ENTER VERIFICATION CODE
        </Link>

        <Link
          to="/"
          className="email-sent-back"
        >
          <ArrowLeft size={15} />
          Back to MAMTA
        </Link>

      </div>

    </main>
  );
};

export default EmailSent;

