export const generateVerificationEmail = (token: string) => {
  const verificationLink = `http://localhost:3000/auth/verify?token=${token}`;

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VAST Discord Registration</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #F7F7F7;
    }
  </style>
</head>
<body style="background-color:#f3f3f3;">
  <center class="wrapper" style="background-color:#f3f3f3; width: 100%; padding: 30px 0px;">
    <div class="container"
      style="background-color: #ffffff; margin-left: 30px; margin-right: 30px; margin-top: 30px;max-width: 600px; box-shadow: 4px 0px 14px #43434333; border-radius: 10px; overflow: hidden;">
      <div class="header" style="background-color: #173f35; width: 100%; padding: 10px 0px; margin-bottom: 80px;">
        <h1
          style="font-family:Raleway,Helvetica,Calibri,Arial,sans-serif; color: #e9e0d2; padding: 0px 30px; margin-bottom: 0px;">
          cubesolves</h1>
        <h2
          style="font-family:Raleway,Helvetica,Calibri,Arial,sans-serif; color: #e9e0d2; margin-top:10px;margin-bottom: 20px;">
          Verification email</h2>
      </div>
      <p style="font-family:Helvetica,Calibri,Arial,sans-serif; margin-bottom: 40px;">Click this <a href="${verificationLink}">link</a> for verification</p>
      <p style="font-family:Helvetica,Calibri,Arial,sans-serif; font-size: 13px;">If you didn't expect an email from us,
        please ignore.</p>
      <p style="font-family:Helvetica,Calibri,Arial,sans-serif; font-size: 13px; margin-bottom: 30px;">Automated mail sent by cubesolves</p>
    </div>
  </center>
</body>
</html>`;
};
