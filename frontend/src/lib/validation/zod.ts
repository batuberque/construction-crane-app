import { z } from 'zod';

const emailValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'E-posta adresinizi girin.' })
    .email({ message: 'Geçerli bir e-posta adresi girin.' }),
  subject: z
    .string()
    .min(3, { message: 'Konu en az 3 karakter olmalı.' })
    .max(120, { message: 'Konu en fazla 120 karakter olabilir.' }),
  message: z
    .string()
    .min(10, { message: 'Mesajınız en az 10 karakter olmalı.' })
    .max(4000, { message: 'Mesajınız en fazla 4000 karakter olabilir.' }),
  captchaToken: z
    .string()
    .min(1, { message: 'Lütfen doğrulamayı tamamlayın.' }),
});

export default emailValidationSchema;
