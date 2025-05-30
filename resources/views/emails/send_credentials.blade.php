<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Akun Lembaga Anda</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #007bff; margin: 0; padding: 0;">

    <!-- Container utama -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 20px;">
                <!-- Box Email -->
                <table width="600px" cellpadding="0" cellspacing="0" border="0" 
                       style="background: #ffffff; border-radius: 8px; padding: 20px; text-align: center; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: #0056b3; color: white; padding: 20px; font-size: 22px; font-weight: bold; border-radius: 8px 8px 0 0;">
                            Smart Exam System
                        </td>
                    </tr>

                    <!-- Konten -->
                    <tr>
                        <td style="padding: 20px;">
                            <p style="font-size: 16px; color: #333;">Berikut ini adalah informasi akun yang dapat Anda gunakan untuk login:</p>
                            <p style="font-size: 18px; font-weight: bold; color: #0056b3;">Username: {{ $email }}</p>
                            <p style="font-size: 18px; font-weight: bold; color: #0056b3;">Password: {{ $password }}</p>
                            <p style="font-size: 16px; color: #333;">Gunakan akun ini untuk login ke sistem:</p>

                            <!-- Tombol Login -->
                            <p>
                                <a href="http://127.0.0.1:8000/login" 
                                   style="display: inline-block; background: #007bff; color: white; padding: 12px 20px; 
                                          text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">
                                    Login Sekarang
                                </a>
                            </p>

                            <p style="font-size: 14px; color: #777;">Jika Anda mengalami kesulitan, silakan hubungi tim support.</p>
                        </td>
                    </tr>

                    <!-- Footer dengan Logo -->
                    <tr>
                        <td style="padding: 20px; text-align: center; border-top: 1px solid #ddd;">
                            <p style="font-size: 14px; color: #555;">Smart Exam System</p>
                            <img src="{{ asset('images/logo.png') }}" alt="Smart Exam System" 
                                 style="width: 120px; height: auto; margin-top: 10px;">
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
