import React, { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import ReCAPTCHA from 'react-google-recaptcha';
import { TbMail, TbMapPin, TbPhone } from 'react-icons/tb';

import Page from '../../lib/ui/Page';
import { SITE, mapsUrl } from '../../lib/site';
import { Email, sendEmail } from '../../services/queries';
import emailValidationSchema from '../../lib/validation/zod';

type FieldName = 'email' | 'subject' | 'message' | 'captchaToken';
type Errors = Partial<Record<FieldName, string>>;

const EMPTY = { email: '', subject: '', message: '' };
const CAPTCHA_KEY = import.meta.env.VITE_CAPTCHA_KEY;

const inputClass =
  'w-full border border-steel-line bg-steel px-3.5 py-3 text-signal placeholder:text-concrete/60 focus:border-hazard transition-colors';

const Contact = () => {
  // Local state: none of this ever needed to be global, and the old version
  // kept it in a shared store so every keystroke re-rendered other consumers.
  const [form, setForm] = useState<Email>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const captchaRef = useRef<ReCAPTCHA>(null);
  const captchaToken = useRef('');

  const { mutate, isLoading, isError } = useMutation<string, Error, Email>(sendEmail);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: Email = { ...form, captchaToken: captchaToken.current };
    const result = emailValidationSchema.safeParse(payload);

    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as FieldName;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    mutate(payload, {
      onSuccess: () => {
        setSent(true);
        setForm(EMPTY);
        setErrors({});
        // The widget was never reset before, so a second send reused a
        // already-consumed token and failed server-side validation.
        captchaRef.current?.reset();
        captchaToken.current = '';
      },
    });
  };

  const fieldProps = (name: FieldName) => ({
    id: name,
    name,
    onChange: handleChange,
    className: inputClass,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  const ErrorText = ({ name }: { name: FieldName }) =>
    errors[name] ? (
      <p id={`${name}-error`} role="alert" className="spec mt-2 text-red-400">
        {errors[name]}
      </p>
    ) : null;

  return (
    <Page>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <p className="spec text-concrete mb-4">İletişim</p>
        <h1 className="text-display-l font-bold uppercase max-w-[16ch]">Bize ulaşın</h1>

        <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <form onSubmit={handleSubmit} noValidate className="max-w-xl">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="spec mb-2 block">
                  E-posta
                </label>
                <input type="email" autoComplete="email" value={form.email} {...fieldProps('email')} />
                <ErrorText name="email" />
              </div>

              <div>
                <label htmlFor="subject" className="spec mb-2 block">
                  Konu
                </label>
                <input type="text" value={form.subject} {...fieldProps('subject')} />
                <ErrorText name="subject" />
              </div>

              <div>
                <label htmlFor="message" className="spec mb-2 block">
                  Mesaj
                </label>
                <textarea rows={7} value={form.message} {...fieldProps('message')} />
                <ErrorText name="message" />
              </div>

              <div>
                {CAPTCHA_KEY ? (
                  <ReCAPTCHA
                    ref={captchaRef}
                    sitekey={CAPTCHA_KEY}
                    hl="tr"
                    onChange={(value) => {
                      captchaToken.current = value ?? '';
                      if (value) setErrors((prev) => ({ ...prev, captchaToken: undefined }));
                    }}
                  />
                ) : (
                  // Fail loud: a missing key used to fall back to a hardcoded
                  // one, which silently broke the form on any other domain.
                  <p role="alert" className="border-l-2 border-red-500 bg-steel p-4">
                    Form şu anda kullanılamıyor (doğrulama yapılandırılmamış).
                    Lütfen bizi telefonla arayın veya e-posta gönderin.
                  </p>
                )}
                <ErrorText name="captchaToken" />
              </div>

              <button
                type="submit"
                disabled={isLoading || !CAPTCHA_KEY}
                className="w-full bg-hazard px-6 py-4 spec font-medium text-graphite hover:bg-hazard/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Gönderiliyor…' : 'E-posta gönderin'}
              </button>

              <div aria-live="polite">
                {sent && (
                  <p className="border-l-2 border-hazard bg-steel p-4">
                    Mesajınız gönderildi. En kısa sürede size döneceğiz.
                  </p>
                )}
                {isError && (
                  <p role="alert" className="border-l-2 border-red-500 bg-steel p-4">
                    Mesaj gönderilemedi. Lütfen tekrar deneyin veya bizi telefonla arayın.
                  </p>
                )}
              </div>
            </div>
          </form>

          <div>
            <h2 className="spec text-concrete mb-5">İletişim bilgileri</h2>
            <ul className="divide-y divide-steel-line border-y border-steel-line">
              <li>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-4 py-5 hover:text-concrete transition-colors"
                >
                  <TbPhone aria-hidden="true" className="shrink-0 text-xl" />
                  <span className="spec">{SITE.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-4 py-5 hover:text-concrete transition-colors"
                >
                  <TbMail aria-hidden="true" className="shrink-0 text-xl" />
                  <span className="break-all">{SITE.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 py-5 hover:text-concrete transition-colors"
                >
                  <TbMapPin aria-hidden="true" className="mt-0.5 shrink-0 text-xl" />
                  <span className="leading-relaxed">{SITE.address}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Contact;
