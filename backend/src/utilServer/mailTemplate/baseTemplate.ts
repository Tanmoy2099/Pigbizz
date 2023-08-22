export const baseEmailTemplate = (message: string, content: string) => {
    const html = `
      <div style="background-color: #eaeaea; padding: 2%;">
        <div style="text-align:center; margin: auto; font-size: 14px; font-color: #353434; max-width: 500px; border-radius: 0.375rem; background: white; padding: 50px">
<div style = 'display: flex; align-items: center;gap: 0.5rem; font-size: 1.25rem; line-height: 1.75rem; font-weight: 600; padding-top: 0.5rem; margin: auto; margin-top: 4.5rem; color: rgb(145 85 253 / var(--tw-text-opacity)); font-size: 2rem;'>PigBizz</div>
          ${message} 
          ${content}
        </div>
      `;
    return html;
}

