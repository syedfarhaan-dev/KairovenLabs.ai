import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

interface ContactLead {
  id: string;
  full_name: string;
  email: string;
  service: string;
  project_details: string;
  status: string;
  ip_address: string;
  source_page: string;
  created_at: string;
  updated_at: string;
}

const mockLeadsStore: ContactLead[] = [];

const getSupabaseAdminClient = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null; 
  }
  return createClient(url, key);
};

const getResendClient = () => {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return null;
  }
  return new Resend(key);
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, errors: ["Method not allowed"] });
  }

  try {
    const { full_name, email, service, project_details, turnstile_token, source_page } = req.body;

    // Server-Side Validations
    const errors: string[] = [];
    if (!full_name || full_name.trim().length < 2) {
      errors.push("Full Name is required (minimum 2 characters).");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("A valid Email Address is required.");
    }
    if (!service || service.trim() === "") {
      errors.push("Selected Service is required.");
    }
    if (!project_details || project_details.trim().length < 10) {
      errors.push("Project Details are required (minimum 10 characters).");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Bot Protection - Cloudflare Turnstile token validation
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || "1x00000000000000000000000000000000AA";
    if (turnstile_token) {
      try {
        const verifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
        const response = await fetch(verifyUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstile_token)}`,
        });
        const outcome = await response.json() as any;
        if (!outcome.success) {
          console.warn("Turnstile bot validation rejected submission.", outcome);
          return res.status(400).json({ success: false, errors: ["Security validation failed. Please solve the captcha."] });
        }
      } catch (err) {
        console.error("Turnstile validation failure: ", err);
      }
    } else {
      if (process.env.TURNSTILE_SECRET_KEY) {
        return res.status(400).json({ success: false, errors: ["Missing security verification token."] });
      }
    }

    const ipAddress = (req.headers["x-forwarded-for"] as string) || req.socket?.remoteAddress || "Unknown";
    const timestamp = new Date().toISOString();
    const newLead: ContactLead = {
      id: crypto.randomUUID(),
      full_name: full_name.trim(),
      email: email.trim(),
      service: service.trim(),
      project_details: project_details.trim(),
      status: "New Lead",
      ip_address: ipAddress,
      source_page: source_page || "Contact Section",
      created_at: timestamp,
      updated_at: timestamp,
    };

    // Save to Supabase
    const supabase = getSupabaseAdminClient();
    
    if (supabase) {
      const { data, error } = await supabase
        .from("contact_leads")
        .insert([{
          full_name: newLead.full_name,
          email: newLead.email,
          service: newLead.service,
          project_details: newLead.project_details,
          status: newLead.status,
          ip_address: newLead.ip_address,
          source_page: newLead.source_page
        }])
        .select();

      if (error) {
        console.error("Supabase insert failed, using fallback in-memory cache:", error);
        mockLeadsStore.unshift(newLead);
      } else {
        console.log("Successfully persisted lead in Supabase:", data);
      }
    } else {
      console.warn("Supabase credentials not configured in environment, falling back to local memory store.");
      mockLeadsStore.unshift(newLead);
    }

    // Prepare Professional Email Notification Layouts
    const adminEmail = process.env.ADMIN_EMAIL || "projects.kairovenlabs@gmail.com";
    const brandColor = "#00FFFF"; // Cyan
    const secondaryBrandColor = "#8A2BE2"; // Visual Purple
    const year = new Date().getFullYear();

    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Lead Inquiry Received</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030303; color: #ffffff; padding: 0; margin: 0; -webkit-font-smoothing: antialiased; }
          .container { max-width: 600px; margin: 40px auto; background-color: #09090b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #09090b, #050505); padding: 30px 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; }
          .logo { color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 2px; }
          .glowing-dot { color: ${brandColor}; }
          .badge { background: rgba(0, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.2); color: ${brandColor}; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 99px; letter-spacing: 1px; display: inline-block; margin-top: 10px; }
          .content { padding: 40px; }
          .title { font-size: 20px; font-weight: 700; color: #ffffff; margin: 0 0 20px 0; letter-spacing: -0.5px; }
          .fields { margin-bottom: 30px; }
          .field-group { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); }
          .field-label { font-size: 10px; font-weight: 700; color: #55555d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px; }
          .field-value { font-size: 14px; color: #e4e4e7; line-height: 1.5; }
          .field-value-rich { background-color: #020202; border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 8px; padding: 15px; font-size: 13px; color: #d4d4d8; line-height: 1.6; font-style: italic; }
          .footer { background-color: #020202; padding: 20px 40px; text-align: center; border-t: 1px solid rgba(255, 255, 255, 0.04); }
          .footer-text { font-size: 11px; color: #4b5563; line-height: 1.5; }
          .footer-link { color: ${brandColor}; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KAIROVEN LABS<span class="glowing-dot">.</span>AI</div>
            <span class="badge">Inquiry Network Lead Capture</span>
          </div>
          <div class="content">
            <h2 class="title">🚀 New Inbound Lead Alert</h2>
            
            <div class="fields">
              <div class="field-group">
                <div class="field-label">Sender Name</div>
                <div class="field-value">${newLead.full_name}</div>
              </div>
              
              <div class="field-group">
                <div class="field-label">Email Address</div>
                <div class="field-value">${newLead.email}</div>
              </div>

              <div class="field-group">
                <div class="field-label">Service Selected</div>
                <div class="field-value" style="color: ${secondaryBrandColor}; font-weight: 600;">${newLead.service}</div>
              </div>

              <div class="field-group">
                <div class="field-label">Lead Origin Metadata</div>
                <div class="field-value" style="font-family: monospace; font-size: 11px; color: #a1a1aa;">
                  Ip: ${newLead.ip_address} | Page: ${newLead.source_page} | Date: ${newLead.created_at}
                </div>
              </div>

              <div class="field-group" style="border-bottom: none;">
                <div class="field-label">Brief & Project Requirements Description</div>
                <div class="field-value-rich">${newLead.project_details.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">
              Automated Operations Dispatch. Powered by Kairoven Labs Internal API.<br>
              <a href="https://kairovenlabs.ai" class="footer-link">kairovenlabs.ai</a> © ${year}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const userHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting Kairoven Labs</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #030303; color: #ffffff; padding: 0; margin: 0; -webkit-font-smoothing: antialiased; }
          .container { max-width: 600px; margin: 40px auto; background-color: #09090b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #09090b, #050505); padding: 30px 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); text-align: center; }
          .logo { color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 2px; }
          .glowing-dot { color: ${brandColor}; }
          .badge { background: rgba(138, 43, 226, 0.1); border: 1px solid rgba(138, 43, 226, 0.2); color: ${secondaryBrandColor}; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 99px; letter-spacing: 1px; display: inline-block; margin-top: 10px; }
          .content { padding: 40px; }
          .title { font-size: 22px; font-weight: 700; color: #ffffff; margin: 0 0 15px 0; letter-spacing: -0.5px; }
          .greeting { font-size: 14px; font-weight: 600; color: #ffffff; margin-bottom: 15px; }
          .body-text { font-size: 13.5px; color: #a1a1aa; line-height: 1.6; margin-bottom: 25px; }
          .summary-card { background-color: #020202; border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 20px; margin-bottom: 25px; }
          .summary-title { font-size: 10px; font-weight: 700; color: #55555d; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
          .summary-item { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.03); }
          .summary-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
          .summary-label { color: #71717a; }
          .summary-val { color: #ffffff; font-weight: 500; }
          .action-prompt { font-size: 13px; color: #a1a1aa; border-left: 2px border-brand-cyan; padding-left: 15px; margin-bottom: 25px; font-style: italic; }
          .footer { background-color: #020202; padding: 25px 40px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.04); }
          .footer-text { font-size: 11px; color: #4b5563; line-height: 1.6; }
          .footer-link { color: ${brandColor}; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KAIROVEN LABS<span class="glowing-dot">.</span>AI</div>
            <span class="badge">Inquiry Dispatch Confirmed</span>
          </div>
          <div class="content">
            <h2 class="title">Inquiry Logged Successfully</h2>
            <div class="greeting">Hello ${newLead.full_name},</div>
            <p class="body-text">
              We have successfully logged your technical project specs at Kairoven Labs. Our lead architect and director will execute a structured requirements assessment within several business hours.
            </p>
            
            <div class="summary-card">
              <div class="summary-title">Summary of Request Details</div>
              
              <div class="summary-item">
                <span class="summary-label">Target Service Domain</span>
                <span class="summary-val" style="color: ${brandColor};">${newLead.service}</span>
              </div>
              
              <div class="summary-item">
                <span class="summary-label">Direct Client Email</span>
                <span class="summary-val">${newLead.email}</span>
              </div>
            </div>

            <p class="action-prompt">
              "We synthesize robust, state-of-the-art automation and high-contrast digital architectures built to empower scaling ventures, whilst sponsoring key sandboxes for student technologists."
            </p>

            <p class="body-text" style="margin-bottom: 0;">
              Expect an architecture advisor to follow up directly to open direct collaboration channels, scheduling links, and scoping docs.
            </p>
          </div>
          <div class="footer">
            <p class="footer-text">
              You are receiving this receipt because of a contact submission at kairovenlabs.ai.<br>
              <strong>Kairoven Labs Artificial Intelligence Systems R&D Unit.</strong><br>
              <a href="https://kairovenlabs.ai" class="footer-link">kairovenlabs.ai</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Attempt Send via Resend, falling back to local simulation logs
    const resend = getResendClient();
    if (resend) {
      try {
        // Send Admin Notification Email
        await resend.emails.send({
          from: "Kairoven Labs <onboarding@resend.dev>", // Note: Resend allows sending from onboarding@resend.dev in testing
          to: adminEmail,
          subject: "🚀 New Kairoven Labs Inquiry",
          html: adminHtmlContent,
        });

        // Send User Receipt
        await resend.emails.send({
          from: "Kairoven Labs <onboarding@resend.dev>",
          to: newLead.email,
          subject: "Thank You for Contacting Kairoven Labs",
          html: userHtmlContent,
        });

        console.log("Emails successfully dispatched via Resend SDK to Admin and User.");
      } catch (emailErr) {
        console.error("Resend delivery failed! Proceeding anyway since database entry is primary:", emailErr);
      }
    } else {
      console.warn("Resend API key is not configured. Emulating emails to server consoling:");
      console.log("\n================[ RESEND EMULATION LOGS ]================");
      console.log(`FROM: Kairoven Labs Office`);
      console.log(`TO ADMIN [${adminEmail}] | SUBJECT: 🚀 New Kairoven Labs Inquiry`);
      console.log(`TO CLIENT [${newLead.email}] | SUBJECT: Thank You for Contacting Kairoven Labs`);
      console.log("=========================================================\n");
    }

    return res.json({
      success: true,
      message: "Your message has been successfully sent. Our team will contact you shortly.",
      leadId: newLead.id
    });

  } catch (error: any) {
    console.error("Critical error inside /api/contact logic:", error);
    return res.status(500).json({
      success: false,
      errors: ["An unexpected server-side exception occurred. Please try again later."]
    });
  }
}
