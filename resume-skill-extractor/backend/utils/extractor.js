function extractData(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const probableName = lines[0];
  
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const phoneRegex = /(\+91)?[\s-]?(\d{10})/;
    const skillsList = ["Java", "Python", "Spring Boot", "Node.js", "React", "SQL", "Docker", "AWS"];
  
    const email = text.match(emailRegex)?.[0] || "Not found";
    const phone = text.match(phoneRegex)?.[0] || "Not found";
    const skills = skillsList.filter(skill => text.toLowerCase().includes(skill.toLowerCase()));
    const experience = lines.filter(l => /[0-9]{4}/.test(l) && /(developer|engineer|intern)/i.test(l));
  
    return { name: probableName, email, phone, skills, experience };
  }
  
  module.exports = extractData;
  