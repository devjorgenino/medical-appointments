# app/mail.py
import os
from aiosmtplib import SMTP
from email.message import EmailMessage

async def send_email(subject: str, body: str, to_email: str):
    # Modo desarrollo: si no hay credenciales → solo imprime
    if not os.getenv("EMAIL_HOST"):
        print("\n" + "="*70)
        print("📧 MODO DESARROLLO - EMAIL NO ENVIADO")
        print(f"Destinatario : {to_email}")
        print(f"Asunto       : {subject}")
        print(f"Enlace       : {body}")
        print("="*70 + "\n")
        return

    message = EmailMessage()
    message["From"] = f"MedicalApp <{os.getenv('EMAIL_USERNAME')}>"
    message["To"] = to_email
    message["Subject"] = subject

    # Texto plano
    message.set_content(
        f"Haz clic en el enlace para cambiar tu contraseña:\n\n{body}\n\nEste enlace expira en 1 hora."
    )

    # HTML bonito
    html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #2563eb; display: flex;">🔒 Recuperación de contraseña</h2>
        <p>Hola,</p>
        <p>Recibimos una solicitud para restablecer tu contraseña en <strong>MedicalApp</strong>.</p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="{body}" style="width:15%; margin:auto; display:block; text-align:center; background:#2563eb; color:white; padding:8px 12px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:calc(1.25 / 0.875);">
            Cambiar Contraseña
          </a>
        </div>
        <p>Este enlace es válido solo por 1 hora.</p>
        <hr>
        <small style="color:#666;">Si no solicitaste este cambio, ignora este correo.</small>
      </body>
    </html>
    """
    message.add_alternative(html, subtype="html")

    # Configuración SMTP
    hostname = os.getenv("EMAIL_HOST", "smtp.gmail.com")
    port = int(os.getenv("EMAIL_PORT", "587"))
    username = os.getenv("EMAIL_USERNAME")
    password = os.getenv("EMAIL_PASSWORD")

    # Cliente SMTP con start_tls automático (perfecto para Gmail)
    smtp_client = SMTP(hostname=hostname, port=port, start_tls=True)

    try:
        async with smtp_client as smtp:
            await smtp.login(username, password)
            await smtp.send_message(message)
        print(f"✅ Email enviado correctamente a {to_email} con Gmail")
    except Exception as e:
        print(f"❌ Error al enviar email con Gmail: {e}")
        raise

# Para probar directamente
if __name__ == "__main__":
    import asyncio
    from dotenv import load_dotenv
    load_dotenv()

    asyncio.run(send_email(
        subject="Prueba MedicalApp",
        body="https://example.com/reset-password?token=TEST123",
        to_email="randyavila04@gmail.com"
    ))