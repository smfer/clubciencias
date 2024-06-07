export const getToken = async () => {
  const paypalApiUrl = "https://api-m.sandbox.paypal.com/v1/oauth2/token";
  const clientId = process.env.CLIENTIDPAYPAL;
  const clientSecret = process.env.SECRETIDPAYPAL;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
  };

  const response = await fetch(paypalApiUrl, requestOptions);

  const datos = await response.json();

  return { access_token: datos.access_token, token_type: datos.token_type };
};
