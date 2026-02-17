module.exports=[37936,(a,b,c)=>{"use strict";Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"registerServerReference",{enumerable:!0,get:function(){return d.registerServerReference}});let d=a.r(11857)},13095,(a,b,c)=>{"use strict";function d(a){for(let b=0;b<a.length;b++){let c=a[b];if("function"!=typeof c)throw Object.defineProperty(Error(`A "use server" file can only export async functions, found ${typeof c}.
Read more: https://nextjs.org/docs/messages/invalid-use-server-value`),"__NEXT_ERROR_CODE",{value:"E352",enumerable:!1,configurable:!0})}}Object.defineProperty(c,"__esModule",{value:!0}),Object.defineProperty(c,"ensureServerEntryExports",{enumerable:!0,get:function(){return d}})},63707,a=>a.a(async(b,c)=>{try{var d=a.i(37936),e=a.i(77607);a.i(40522);var f=a.i(77419),g=a.i(13095),h=b([e]);async function i(a,b){try{await (0,e.signIn)("credentials",b)}catch(a){if(a instanceof f.AuthError)if("CredentialsSignin"===a.type)return"Invalid credentials.";else return"Something went wrong.";throw a}}async function j(){await (0,e.signOut)()}[e]=h.then?(await h)():h,(0,g.ensureServerEntryExports)([i,j]),(0,d.registerServerReference)(i,"607051c4334dde25deecd5a7467ce9cd3142e1efc7",null),(0,d.registerServerReference)(j,"00d407b4cb47e601dfebbf78dd230a8e4c5a7b9fcc",null),a.s(["authenticate",()=>i,"logout",()=>j]),c()}catch(a){c(a)}},!1),90848,a=>a.a(async(b,c)=>{try{var d=a.i(37936),e=a.i(28725),f=a.i(66518),g=a.i(43676),h=a.i(13095),i=b([f,g]);async function j(a){let{tenant:b}=await (0,g.requireTenantMembership)(),c=a.get("invoiceId");if(!c)throw Error("Invoice ID is required");let d=await f.prisma.invoice.findFirst({where:{id:c,tenantId:b.id},include:{client:!0}});if(!d)throw Error("Invoice not found");let h=d.client?.email,i=d.client?`${d.client.firstName} ${d.client.lastName||""}`.trim():"Valued Customer";if(!h)throw Error("Client email not found");let j=`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #333; margin: 0; }
        .info { margin-bottom: 30px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .details { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .total { font-size: 24px; font-weight: bold; color: #6366f1; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${b.name}</h1>
        <p>Invoice #${d.invoiceNumber}</p>
      </div>
      
      <div class="info">
        <div class="info-row">
          <strong>Date:</strong>
          <span>${new Date(d.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="info-row">
          <strong>Due Date:</strong>
          <span>${new Date(d.dueDate).toLocaleDateString()}</span>
        </div>
        <div class="info-row">
          <strong>Status:</strong>
          <span style="color: ${"PAID"===d.status?"#10b981":"#f59e0b"}">
            ${d.status}
          </span>
        </div>
      </div>
      
      <div class="details">
        <h3>Invoice Details</h3>
        <p><strong>Client:</strong> ${i}</p>
        
        <div class="total">
          Total Amount: $${d.totalAmount.toFixed(2)} ${d.currency}
        </div>
      </div>
      
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>${b.name} • Powered by Nexus SaaS</p>
      </div>
    </body>
    </html>
  `;try{await e.resend.emails.send({from:e.EMAIL_FROM,to:h,subject:`Invoice #${d.invoiceNumber} from ${b.name}`,html:j}),await f.prisma.auditLog.create({data:{tenantId:b.id,action:"INVOICE_SENT",entity:"Invoice",entityId:c,metadata:{to:h,invoiceNumber:d.invoiceNumber}}})}catch(a){throw console.error("Email sending failed:",a),Error("Failed to send invoice email")}}async function k(a){let{tenant:b}=await (0,g.requireTenantMembership)(),c=a.get("invoiceId");if(!c)throw Error("Invoice ID is required");let d=await f.prisma.invoice.findFirst({where:{id:c,tenantId:b.id,status:"PENDING"},include:{client:!0}});if(!d||!d.client?.email)throw Error("Invoice not found or client email missing");let h=`${d.client.firstName} ${d.client.lastName||""}`.trim(),i=Math.floor((Date.now()-new Date(d.dueDate).getTime())/864e5),j=`
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #f59e0b;">Payment Reminder</h2>
      <p>Dear ${h},</p>
      <p>This is a friendly reminder that invoice <strong>#${d.invoiceNumber}</strong> 
      for <strong>$${d.totalAmount.toFixed(2)}</strong> is ${i>0?`${i} days overdue`:"due soon"}.</p>
      
      <p><strong>Original Due Date:</strong> ${new Date(d.dueDate).toLocaleDateString()}</p>
      
      <p>Please process the payment at your earliest convenience.</p>
      
      <p>Best regards,<br>${b.name}</p>
    </body>
    </html>
  `;try{await e.resend.emails.send({from:e.EMAIL_FROM,to:d.client.email,subject:`Payment Reminder: Invoice #${d.invoiceNumber}`,html:j}),await f.prisma.auditLog.create({data:{tenantId:b.id,action:"INVOICE_REMINDER_SENT",entity:"Invoice",entityId:c,metadata:{daysOverdue:i}}})}catch(a){throw console.error("Reminder email failed:",a),Error("Failed to send reminder")}}async function l(a){let{tenant:b}=await (0,g.requireTenantMembership)();if(!a.clientId)throw Error("Client is required");if(!a.items?.length)throw Error("At least one item is required");let c=0,d=a.items.map(a=>{let b=a.quantity*a.unitPrice;return c+=b,{description:a.description,quantity:a.quantity,unitPrice:a.unitPrice,total:b}}),e=Date.now().toString().slice(-6),h=`INV-${e}`;await f.prisma.invoice.create({data:{tenantId:b.id,clientId:a.clientId,invoiceNumber:h,dueDate:new Date(a.dueDate),totalAmount:c,status:"PENDING",items:{create:d}}})}[f,g]=i.then?(await i)():i,(0,h.ensureServerEntryExports)([j,k,l]),(0,d.registerServerReference)(j,"407be5bd33f53cb83d9374eeb70344533eb1418a09",null),(0,d.registerServerReference)(k,"40f584e9201b94dc27459885483537bb2b7e9a7f09",null),(0,d.registerServerReference)(l,"409bcdc5b7d71d8a5b9efb31b8cfd23a484dd2c00e",null),a.s(["createInvoice",()=>l,"sendInvoice",()=>j,"sendInvoiceReminder",()=>k]),c()}catch(a){c(a)}},!1),68845,a=>a.a(async(b,c)=>{try{var d=a.i(63707),e=a.i(90848),f=b([d,e]);[d,e]=f.then?(await f)():f,a.s([]),c()}catch(a){c(a)}},!1),53899,a=>a.a(async(b,c)=>{try{var d=a.i(68845),e=a.i(63707),f=a.i(90848),g=b([d,e,f]);[d,e,f]=g.then?(await g)():g,a.s(["00d407b4cb47e601dfebbf78dd230a8e4c5a7b9fcc",()=>e.logout,"407be5bd33f53cb83d9374eeb70344533eb1418a09",()=>f.sendInvoice,"409bcdc5b7d71d8a5b9efb31b8cfd23a484dd2c00e",()=>f.createInvoice,"40f584e9201b94dc27459885483537bb2b7e9a7f09",()=>f.sendInvoiceReminder]),c()}catch(a){c(a)}},!1)];

//# sourceMappingURL=_ebd099c6._.js.map