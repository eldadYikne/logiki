export interface RequestSender {
  key: string;
  user: string;
  pass: string;
  sender: string;
  recipient: string;
  msg: string;
}
export async function sendMessageToContact(recipient: string, msg: string) {
  try {
    const url = "https://api.sms4free.co.il/ApiSMS/v2/SendSMS";
    const data: RequestSender = {
      key: import.meta.env.VITE_MESSAGE_KEY,
      user: import.meta.env.VITE_MESSAGE_USER,
      pass: import.meta.env.VITE_MESSAGE_PASS,
      sender: import.meta.env.VITE_MESSAGE_SENDER,
      recipient: recipient,
      msg: msg,
    };
    console.log("data", data);
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    console.log("resresres", result);
    return result.status;
  } catch (err) {
    console.log("err", err);
  }
}
