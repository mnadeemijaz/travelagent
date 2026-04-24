<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
        .header { background: #0d9488; padding: 28px 32px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 20px; }
        .body { padding: 32px; }
        .body p { color: #374151; line-height: 1.6; margin: 0 0 16px; }
        .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
        .info-box p { margin: 4px 0; font-size: 14px; color: #065f46; }
        .info-box strong { color: #064e3b; }
        .btn { display: inline-block; background: #0d9488; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-weight: bold; font-size: 14px; }
        .footer { text-align: center; padding: 20px 32px; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✈ AL Abrar Group of Travels</h1>
        </div>
        <div class="body">
            <p>A new user has registered on the website and is waiting for your approval.</p>

            <div class="info-box">
                <p><strong>Name:</strong> {{ $newUser->name }}</p>
                <p><strong>Email:</strong> {{ $newUser->email }}</p>
                <p><strong>Role:</strong> {{ $newUser->roles->first()?->name ?? 'user' }}</p>
                <p><strong>Registered:</strong> {{ $newUser->created_at->format('d M Y, h:i A') }}</p>
            </div>

            <p>Please log in to the admin panel to review and approve or reject this registration.</p>

            <p style="text-align:center; margin-top: 24px;">
                <a href="{{ url('/users') }}" class="btn">Go to User Management</a>
            </p>
        </div>
        <div class="footer">
            © {{ date('Y') }} AL Abrar Group of Travels. This is an automated notification.
        </div>
    </div>
</body>
</html>
