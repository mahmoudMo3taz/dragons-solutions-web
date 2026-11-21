import type { InquiryInput } from "./validation";

/**
 * Called after an inquiry is saved. Hook your notifications in here:
 * email (SMTP, Resend, Microsoft Graph), a Teams or Slack webhook,
 * a WhatsApp Business message, or a ticket in your helpdesk.
 * It must never throw, so a failed notification does not lose the inquiry.
 */
export async function notifyNewInquiry(id: string, data: InquiryInput) {
  try {
    console.info(`[inquiry] ${id} from ${data.name} <${data.email}> about ${data.service}`);
    // Example, Teams/Slack incoming webhook:
    // await fetch(process.env.INQUIRY_WEBHOOK_URL!, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ text: `New inquiry from ${data.name}: ${data.service}` }),
    // });
  } catch (err) {
    console.error("[inquiry] notification failed", err);
  }
}
