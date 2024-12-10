import { Linking } from "react-native";

const createCheckout = (transaction) => {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      authorization: "Basic c2tfdGVzdF9vcHhCNGh3S3hKUERqNmJDM1YzTUFkajc6", // Replace with your valid API key.
    },
    body: JSON.stringify({
      data: {
        attributes: {
          billing: {
            name:
              transaction?.currentUser.firstName +
              " " +
              transaction?.currentUser.lastName,
            email: transaction?.currentUser.email,
            phone: transaction?.currentUser.phoneNumber,
          },
          description: transaction?.id,
          line_items: [
            {
              amount: transaction?.totalPrice * 100, // Amount in centavos; 50000 centavos = 500 PHP
              currency: "PHP",
              description: "Bear Ride Express Service",
              name:
                transaction?.serviceType == "Pahatod"
                  ? "Transportation Service"
                  : "Delivery Service",
              quantity: 1,
            },
          ],
          payment_method_types: ["gcash"],
          reference_number: transaction.id,
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          statement_descriptor: "Bear Rider Express",
        },
        redirect: {
          success: "bear://payment-success",
          failed: "bear://payment-failed",
        },
      },
    }),
  };

  return fetch("https://api.paymongo.com/v1/checkout_sessions", options)
    .then((res) => res.json())
    .then((res) => {
      console.log(res.data);
      return res.data; // Return the checkout URL for further use.
    })
    .catch((err) => {
      console.error(err);
      throw err; // Re-throw the error so it can be handled by the caller.
    });
};

const getCheckoutSession = (checkoutSessionId) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: "Basic c2tfdGVzdF9vcHhCNGh3S3hKUERqNmJDM1YzTUFkajc6", // Replace with your valid API key.
    },
  };

  return fetch(
    `https://api.paymongo.com/v1/checkout_sessions/${checkoutSessionId}`,
    options
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => data)
    .catch((err) => {
      console.error("Error fetching checkout session:", err);
      throw err; // Re-throw for the caller to handle.
    });
};

export { createCheckout, getCheckoutSession };
