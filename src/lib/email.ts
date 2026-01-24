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
