import nodemailer from 'nodemailer';

// Create transporter - will use environment variables
const createTransporter = () => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('[EMAIL] SMTP not configured. Email sending is disabled.');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// Email template for inquiry answer
const getInquiryAnswerTemplate = (inquiryTitle: string, answer: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 24px; }
        .inquiry-title { color: #64748b; font-size: 14px; margin-bottom: 8px; }
        .answer-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin: 16px 0; }
        .footer { text-align: center; padding: 16px; color: #94a3b8; font-size: 12px; }
        .btn { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📬 문의 답변이 도착했습니다</h1>
        </div>
        <div class="content">
            <p class="inquiry-title">문의 제목:</p>
            <h2 style="margin: 0 0 16px 0; color: #1e293b;">${inquiryTitle}</h2>
            
            <p style="color: #64748b; margin-bottom: 8px;">답변 내용:</p>
            <div class="answer-box">
                ${answer.replace(/\n/g, '<br>')}
            </div>
            
            <a href="${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://janghanju-server.duckdns.org'}/profile" class="btn">
                내 문의 확인하기
            </a>
        </div>
        <div class="footer">
            <p>이 이메일은 OneWeek에서 발송되었습니다.</p>
        </div>
    </div>
</body>
</html>
`;

// Email template for comment reply
const getCommentReplyTemplate = (newsTitle: string, replyContent: string, replierName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 24px; }
        .reply-box { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 8px; margin: 16px 0; }
        .replier { font-weight: 600; color: #166534; margin-bottom: 8px; }
        .footer { text-align: center; padding: 16px; color: #94a3b8; font-size: 12px; }
        .btn { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💬 댓글에 답글이 달렸습니다</h1>
        </div>
        <div class="content">
            <p style="color: #64748b; font-size: 14px;">게시글: <strong style="color: #1e293b;">${newsTitle}</strong></p>
            
            <div class="reply-box">
                <p class="replier">${replierName}님의 답글:</p>
                ${replyContent.replace(/\n/g, '<br>')}
            </div>
            
            <a href="${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://janghanju-server.duckdns.org'}/news" class="btn">
                답글 확인하기
            </a>
        </div>
        <div class="footer">
            <p>이 이메일은 OneWeek에서 발송되었습니다.</p>
        </div>
    </div>
</body>
</html>
`;

// Send inquiry answer email
export async function sendInquiryAnswerEmail(
    to: string,
    inquiryTitle: string,
    answer: string
): Promise<boolean> {
    const transporter = createTransporter();
    if (!transporter) {
        console.log(`[EMAIL SIMULATED] To: ${to}, Subject: 문의 답변 - ${inquiryTitle}`);
        return false;
    }

    try {
        await transporter.sendMail({
            from: `"OneWeek 알림" <${process.env.SMTP_USER}>`,
            to,
            subject: `[OneWeek] 문의에 대한 답변이 도착했습니다: ${inquiryTitle}`,
            html: getInquiryAnswerTemplate(inquiryTitle, answer),
        });
        console.log(`[EMAIL SENT] Inquiry answer to: ${to}`);
        return true;
    } catch (error) {
        console.error('[EMAIL ERROR]', error);
        return false;
    }
}

// Send comment reply notification email
export async function sendCommentReplyEmail(
    to: string,
    newsTitle: string,
    replyContent: string,
    replierName: string
): Promise<boolean> {
    const transporter = createTransporter();
    if (!transporter) {
        console.log(`[EMAIL SIMULATED] Comment reply to: ${to}`);
        return false;
    }

    try {
        await transporter.sendMail({
            from: `"OneWeek 알림" <${process.env.SMTP_USER}>`,
            to,
            subject: `[OneWeek] "${newsTitle}" 게시글에 답글이 달렸습니다`,
            html: getCommentReplyTemplate(newsTitle, replyContent, replierName),
        });
        console.log(`[EMAIL SENT] Comment reply to: ${to}`);
        return true;
    } catch (error) {
        console.error('[EMAIL ERROR]', error);
        return false;
    }
}

// Email template for password reset
const getPasswordResetTemplate = (resetLink: string, expiresIn: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 24px; text-align: center; }
        .info-box { background: #fffbeb; border: 1px solid #fcd34d; padding: 16px; border-radius: 8px; margin: 16px 0; color: #92400e; font-size: 14px; }
        .footer { text-align: center; padding: 16px; color: #94a3b8; font-size: 12px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; margin: 20px 0; font-weight: 600; }
        .link-text { color: #64748b; font-size: 12px; word-break: break-all; margin-top: 16px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 비밀번호 재설정</h1>
        </div>
        <div class="content">
            <p style="color: #475569; margin-bottom: 24px;">비밀번호 재설정을 요청하셨습니다.<br>아래 버튼을 클릭하여 새 비밀번호를 설정해주세요.</p>
            
            <a href="${resetLink}" class="btn">
                비밀번호 재설정하기
            </a>
            
            <div class="info-box">
                ⏰ 이 링크는 <strong>${expiresIn}</strong> 후에 만료됩니다.
            </div>
            
            <p class="link-text">버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:<br>${resetLink}</p>
        </div>
        <div class="footer">
            <p>본인이 요청하지 않았다면 이 이메일을 무시해주세요.</p>
            <p>이 이메일은 OneWeek에서 발송되었습니다.</p>
        </div>
    </div>
</body>
</html>
`;

// Send password reset email
export async function sendPasswordResetEmail(
    to: string,
    resetToken: string
): Promise<boolean> {
    const transporter = createTransporter();
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://janghanju-server.duckdns.org';
    const resetLink = `${baseUrl}/ko/reset-password?token=${resetToken}`;
    const expiresIn = '1시간';

    if (!transporter) {
        console.log(`[EMAIL SIMULATED] Password reset to: ${to}, Link: ${resetLink}`);
        return false;
    }

    try {
        await transporter.sendMail({
            from: `"OneWeek 보안" <${process.env.SMTP_USER}>`,
            to,
            subject: '[OneWeek] 비밀번호 재설정 링크',
            html: getPasswordResetTemplate(resetLink, expiresIn),
        });
        console.log(`[EMAIL SENT] Password reset to: ${to}`);
        return true;
    } catch (error) {
        console.error('[EMAIL ERROR]', error);
        return false;
    }
}

