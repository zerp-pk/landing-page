<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #1f2937; line-height: 1.6;">
    <h2 style="margin-bottom: 4px;">New contact form message</h2>
    <p style="color: #6b7280; margin-top: 0;">{{ $messageSubject }}</p>

    <table style="border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <td style="padding: 4px 12px 4px 0; color: #6b7280;">Name</td>
            <td style="padding: 4px 0;">{{ $senderName }}</td>
        </tr>
        <tr>
            <td style="padding: 4px 12px 4px 0; color: #6b7280;">Email</td>
            <td style="padding: 4px 0;">{{ $senderEmail }}</td>
        </tr>
    </table>

    <div style="white-space: pre-wrap; border-left: 3px solid #DA8F29; padding-left: 12px;">{{ $messageBody }}</div>
</body>
</html>
