import { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  MessageCircle,
} from "lucide-react";

import "./AdminContacts.css";

const API_URL = "http://localhost:3000/api";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  /* =========================================================
     TOKEN
  ========================================================= */

  const getToken = () => {
    return localStorage.getItem("mamta_admin_token");
  };

  /* =========================================================
     LOAD CONTACTS
     Used for manual refresh / reloading
  ========================================================= */

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        setContacts([]);
        return;
      }

      const response = await axios.get(
        `${API_URL}/contact`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContacts(
        response.data?.contacts || []
      );
    } catch (error) {
      console.error(
        "ADMIN CONTACTS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
     React 19 SAFE
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadContacts = async () => {
      const token = getToken();

      if (!token) {
        if (!cancelled) {
          setContacts([]);
          setLoading(false);
        }

        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/contact`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (cancelled) {
          return;
        }

        setContacts(
          response.data?.contacts || []
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "ADMIN CONTACTS ERROR:",
          error
        );

        setContacts([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadContacts();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     UPDATE STATUS
  ========================================================= */

  const updateStatus = async (id, status) => {
    try {
      const token = getToken();

      await axios.patch(
        `${API_URL}/contact/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /*
       * Update the table immediately instead of
       * fetching everything again.
       */

      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id
            ? {
                ...contact,
                status,
              }
            : contact
        )
      );

      if (selectedContact?._id === id) {
        setSelectedContact((prev) => ({
          ...prev,
          status,
        }));
      }
    } catch (error) {
      console.error(
        "UPDATE CONTACT STATUS ERROR:",
        error
      );
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const deleteContact = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = getToken();

      await axios.delete(
        `${API_URL}/contact/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContacts((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      if (selectedContact?._id === id) {
        setSelectedContact(null);
      }
    } catch (error) {
      console.error(
        "DELETE CONTACT ERROR:",
        error
      );
    }
  };

  /* =========================================================
     STATS
  ========================================================= */

  const totalMessages = contacts.length;

  const newMessages = contacts.filter(
    (item) => item.status === "New"
  ).length;

  const readMessages = contacts.filter(
    (item) => item.status === "Read"
  ).length;

  const repliedMessages = contacts.filter(
    (item) => item.status === "Replied"
  ).length;

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="admin-contacts">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="admin-contacts-header">

        <div>
          <span>
            CUSTOMER COMMUNICATION
          </span>

          <h1>
            Contact Messages
          </h1>

          <p>
            Manage messages received
            from MAMTA customers.
          </p>
        </div>

      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="contacts-stats">

        <div className="contact-stat-card">

          <div className="contact-stat-icon">
            <MessageCircle size={19} />
          </div>

          <div>
            <span>
              TOTAL
            </span>

            <strong>
              {totalMessages}
            </strong>
          </div>

        </div>

        <div className="contact-stat-card">

          <div className="contact-stat-icon new">
            <Mail size={19} />
          </div>

          <div>
            <span>
              NEW
            </span>

            <strong>
              {newMessages}
            </strong>
          </div>

        </div>

        <div className="contact-stat-card">

          <div className="contact-stat-icon read">
            <Eye size={19} />
          </div>

          <div>
            <span>
              READ
            </span>

            <strong>
              {readMessages}
            </strong>
          </div>

        </div>

        <div className="contact-stat-card">

          <div className="contact-stat-icon replied">
            <CheckCircle size={19} />
          </div>

          <div>
            <span>
              REPLIED
            </span>

            <strong>
              {repliedMessages}
            </strong>
          </div>

        </div>

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="contacts-layout">

        {/* ===================================================
            MESSAGE LIST
        =================================================== */}

        <div className="contacts-list">

          <div className="contacts-list-header">

            <h2>
              Messages
            </h2>

            <span>
              {contacts.length}
            </span>

          </div>

          {loading ? (
            <div className="contacts-loading">
              Loading messages...
            </div>
          ) : contacts.length === 0 ? (
            <div className="contacts-empty">

              <Mail size={34} />

              <h3>
                No messages yet
              </h3>

              <p>
                Customer messages will
                appear here.
              </p>

            </div>
          ) : (
            <div className="contacts-table-wrapper">

              <table className="contacts-table">

                <thead>

                  <tr>
                    <th>
                      CUSTOMER
                    </th>

                    <th>
                      SUBJECT
                    </th>

                    <th>
                      DATE
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTION
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {contacts.map(
                    (contact) => (
                      <tr
                        key={contact._id}
                      >

                        <td>

                          <div className="customer-cell">

                            <div className="customer-avatar">
                              {contact.name
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "C"}
                            </div>

                            <div>

                              <strong>
                                {contact.name}
                              </strong>

                              <span>
                                {contact.email}
                              </span>

                            </div>

                          </div>

                        </td>

                        <td>
                          <span className="subject-cell">
                            {contact.subject}
                          </span>
                        </td>

                        <td>
                          <span className="date-cell">
                            {formatDate(
                              contact.createdAt
                            )}
                          </span>
                        </td>

                        <td>

                          <span
                            className={`contact-status ${
                              (
                                contact.status ||
                                "New"
                              ).toLowerCase()
                            }`}
                          >
                            {contact.status ||
                              "New"}
                          </span>

                        </td>

                        <td>

                          <div className="contact-actions">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedContact(
                                  contact
                                )
                              }
                              title="View message"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              className="delete"
                              onClick={() =>
                                deleteContact(
                                  contact._id
                                )
                              }
                              title="Delete message"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* ===================================================
            MESSAGE DETAILS
        =================================================== */}

        <div className="contact-details">

          {!selectedContact ? (
            <div className="contact-details-empty">

              <MessageCircle size={38} />

              <h3>
                Select a message
              </h3>

              <p>
                Click the eye icon to
                view customer details.
              </p>

            </div>
          ) : (
            <>

              <div className="contact-details-header">

                <div>

                  <span>
                    MESSAGE DETAILS
                  </span>

                  <h2>
                    {selectedContact.subject}
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedContact(null)
                  }
                >
                  ×
                </button>

              </div>

              <div className="contact-customer-details">

                <div className="detail-avatar">
                  {selectedContact.name
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}
                </div>

                <div>

                  <strong>
                    {selectedContact.name}
                  </strong>

                  <a
                    href={`mailto:${selectedContact.email}`}
                  >
                    {selectedContact.email}
                  </a>

                  {selectedContact.phone && (
                    <a
                      href={`tel:${selectedContact.phone}`}
                    >
                      {selectedContact.phone}
                    </a>
                  )}

                </div>

              </div>

              <div className="contact-message-box">

                <span>
                  MESSAGE
                </span>

                <p>
                  {selectedContact.message}
                </p>

              </div>

              <div className="contact-message-meta">

                <div>

                  <Clock size={16} />

                  <span>
                    {formatDate(
                      selectedContact.createdAt
                    )}
                  </span>

                </div>

                <div>

                  <span>
                    Status:
                  </span>

                  <strong>
                    {selectedContact.status}
                  </strong>

                </div>

              </div>

              <div className="contact-status-actions">

                <span>
                  UPDATE STATUS
                </span>

                <div>

                  <button
                    type="button"
                    className={
                      selectedContact.status ===
                      "New"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      updateStatus(
                        selectedContact._id,
                        "New"
                      )
                    }
                  >
                    New
                  </button>

                  <button
                    type="button"
                    className={
                      selectedContact.status ===
                      "Read"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      updateStatus(
                        selectedContact._id,
                        "Read"
                      )
                    }
                  >
                    Read
                  </button>

                  <button
                    type="button"
                    className={
                      selectedContact.status ===
                      "Replied"
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      updateStatus(
                        selectedContact._id,
                        "Replied"
                      )
                    }
                  >
                    Replied
                  </button>

                </div>

              </div>

              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                className="contact-reply-button"
              >
                <Mail size={17} />
                Reply via Email
              </a>

              <button
                type="button"
                className="contact-delete-button"
                onClick={() =>
                  deleteContact(
                    selectedContact._id
                  )
                }
              >
                <Trash2 size={16} />
                Delete Message
              </button>

            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminContacts;