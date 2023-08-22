import { baseEmailTemplate } from "./baseTemplate";

export function forgotPasswordtemplate(message: string, ctaLink: string, ctaLabel: string) {

    const customContent = `
    <p style="margin: 30px 0px; text-align: center">
      <a href="${ctaLink}" style="background-color: #9155FD; white-space: nowrap; color: white; border-color: transparent; border-width: 1px; border-radius: 0.375rem; font-size: 18px; padding-left: 16px; padding-right: 16px; padding-top: 10px; padding-bottom: 10px; text-decoration: none; margin-top: 4px; margin-bottom: 4px; color:white">
        ${ctaLabel}
      </a>
      </p>`;

    const html = baseEmailTemplate(message, customContent);
    return html;
}