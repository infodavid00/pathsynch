export function template_emailVerification(fname, link) {
  const template = `
   <div style="width:94%;margin:auto;padding:10px;font-size:14.5px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div>Hello <strong>${fname}</strong>,</div>
    <div>Your pathsynch account verification link is <a style="color:dodgerblue;text-decoration:none;" href="${link}">${link}</a>.</div>
    <p>Do not disclose with anyone.</p>
   </div>
  `;
  return template;
}
// email verification template_

export function template_emailVerification_fp(fname, link) {
  const template = `
    <div style="width:94%;margin:auto;padding:10px;font-size:14.5px;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div>Hello <strong>${fname}</strong>,</div>
    <div>Your pathsynch reset password link is <a  style="color:dodgerblue;text-decoration:none;" href="${link}">${link}</a>.</div>
    <p>Do not disclose with anyone.</p>
   </div>
  `;
  return template;
}
// email verification template_ forgotten password
