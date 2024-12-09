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
            phone: transaction?.currentUser.phone,
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
          payment_method_types: ["card", "gcash"], // Available options depend on PayMongo.
          reference_number: "REF-2023123456",
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,

          statement_descriptor: "Bear Rider Express",
        },
        redirect: {
          success: "yourapp://payment-success",
          failed: "yourapp://payment-failed",
        },
      },
    }),
  };

  fetch("https://api.paymongo.com/v1/checkout_sessions", options)
    .then((res) => res.json())
    .then((res) => {
      const { checkout_url } = res.data.attributes;
      Linking.openURL(checkout_url);
    })
    .catch((err) => console.error(err));
};

export default createCheckout;
