export const getEmailTemplate = async (templateName, data) => {
    try {
      const templateModule = await import(`./templates/${templateName}.js`);
      return templateModule.default(data);
    } catch (err) {
      console.error("❌ Template loading error:", err);
      return `<p>Template not found</p>`;
    }
  };
  