
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

import {
  CheckCircle2,
  Clock3,
  AlertCircle,
  
  ArrowRight,
} from "lucide-react";

import "./PaymentSuccess.css";
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://mamta-app-8.onrender.com/api";

const PaymentSuccess = () => {
  const [searchParams] =
    useSearchParams();

  const orderId =
    searchParams.get("order");

  const tracker =
    searchParams.get("tracker");

  const [status, setStatus] =
    useState("checking");

  const [order, setOrder] =
    useState(null);

  const [message, setMessage] =
    useState("");

  useEffect(() => {
    const checkPayment =
      async () => {
        const token =
          localStorage.getItem(
            "mamta_user_token"
          );

        if (!token) {
          setStatus("error");

          setMessage(
            "Please login to view your order."
          );

          return;
        }

        if (!orderId || !tracker) {
          setStatus("error");

          setMessage(
            "Payment information is incomplete."
          );

          return;
        }

        try {
          /* ==========================================
             CHECK ORDER
          ========================================== */

          const orderResponse =
            await axios.get(
              `${API_URL}/orders/${orderId}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const fetchedOrder =
            orderResponse.data.order ||
            orderResponse.data;

          setOrder(
            fetchedOrder
          );

          /* ==========================================
             CHECK PAYMENT STATUS
          ========================================== */

          const paymentResponse =
            await axios.get(
              `${API_URL}/payments/status/${tracker}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const paymentData =
            paymentResponse.data;

          /*
             IMPORTANT:

             Only the database paymentStatus
             determines final success.

             The webhook is responsible for
             changing it to Paid.
          */

          if (
            fetchedOrder.paymentStatus ===
            "Paid"
          ) {
            setStatus("success");

            return;
          }

          /* ==========================================
             WEBHOOK MAY TAKE A FEW SECONDS
          ========================================== */

          setStatus("pending");

          setMessage(
            paymentData?.state
              ? `Payment is being processed (${paymentData.state}).`
              : "Your payment is being verified."
          );
        } catch (error) {
          console.error(
            "PAYMENT SUCCESS ERROR:",
            error
          );

          setStatus("error");

          setMessage(
            error.response?.data
              ?.message ||
              "Unable to verify your payment."
          );
        }
      };

    checkPayment();
  }, [orderId, tracker]);

  /* =====================================================
     CHECKING
  ===================================================== */

  if (status === "checking") {
    return (
      <main className="payment-success-page">

        <div className="payment-result-card">

          <div className="payment-result-icon checking">
            <Clock3 size={34} />
          </div>

          <h1>
            Verifying Payment
          </h1>

          <p>
            Please wait while we
            verify your payment.
          </p>

        </div>

      </main>
    );
  }

  /* =====================================================
     SUCCESS
  ===================================================== */

  if (status === "success") {
    return (
      <main className="payment-success-page">

        <div className="payment-result-card success">

          <div className="payment-result-icon">

            <CheckCircle2
              size={42}
            />

          </div>

          <span className="payment-eyebrow">
            PAYMENT CONFIRMED
          </span>

          <h1>
            Thank You!
          </h1>

          <p>
            Your MAMTA CIRCLE order
            has been confirmed.
          </p>

          {order && (
            <div className="payment-order-details">

              <div>
                <span>
                  Order Number
                </span>

                <strong>
                  {order.orderNumber}
                </strong>
              </div>

              <div>
                <span>
                  Payment
                </span>

                <strong>
                  {order.paymentStatus}
                </strong>
              </div>

              <div>
                <span>
                  Total
                </span>

                <strong>
                  Rs.{" "}
                  {Number(
                    order.total
                  ).toLocaleString()}
                </strong>
              </div>

            </div>
          )}

          <div className="payment-success-actions">

            <Link
              to="/orders"
              className="payment-primary-button"
            >
              View My Orders
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/shop"
              className="payment-secondary-button"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </main>
    );
  }

  /* =====================================================
     PENDING
  ===================================================== */

  if (status === "pending") {
    return (
      <main className="payment-success-page">

        <div className="payment-result-card pending">

          <div className="payment-result-icon pending">
            <Clock3 size={40} />
          </div>

          <span className="payment-eyebrow">
            PAYMENT PROCESSING
          </span>

          <h1>
            We're Verifying Your Payment
          </h1>

          <p>
            {message ||
              "Your payment was returned successfully, but Safepay has not yet confirmed it in our system."}
          </p>

          {order && (
            <div className="payment-order-details">

              <div>
                <span>
                  Order Number
                </span>

                <strong>
                  {order.orderNumber}
                </strong>
              </div>

              <div>
                <span>
                  Payment Status
                </span>

                <strong>
                  {order.paymentStatus}
                </strong>
              </div>

            </div>
          )}

          <Link
            to="/orders"
            className="payment-primary-button"
          >
            View Order
            <ArrowRight size={17} />
          </Link>

        </div>

      </main>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  return (
    <main className="payment-success-page">

      <div className="payment-result-card error">

        <div className="payment-result-icon error">
          <AlertCircle size={40} />
        </div>

        <span className="payment-eyebrow">
          PAYMENT VERIFICATION
        </span>

        <h1>
          Something Went Wrong
        </h1>

        <p>
          {message ||
            "We could not verify your payment."}
        </p>

        <div className="payment-success-actions">

          <Link
            to="/checkout"
            className="payment-primary-button"
          >
            Return to Checkout
          </Link>

          <Link
            to="/shop"
            className="payment-secondary-button"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </main>
  );
};

export default PaymentSuccess;

