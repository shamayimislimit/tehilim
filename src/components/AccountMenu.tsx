import { useEffect, useState } from 'react';
import { User, UserCheck, LogOut, ArrowLeft, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/auth';
import { Language } from '@/types/tehilim';
import { toast } from 'sonner';

/** Tiny tri-lingual helper — login UI strings live here, not in the global dict. */
const tr = (lang: Language, fr: string, en: string, he: string) =>
  lang === 'french' ? fr : lang === 'hebrew' ? he : en;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Account affordance: a circular icon (top toolbar) that opens a 2-step
 * passwordless login — email → 6-digit code typed back in-app (no redirect,
 * works inside an installed PWA). When logged in it shows the account + logout.
 */
export const AccountMenu = ({ language }: { language: Language }) => {
  const { user, ready, requestCode, verifyCode, logout, loginOpen: open, setLoginOpen: setOpen } = useAuth();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const isRtl = language === 'hebrew';

  // Fresh state every time the dialog (re)opens for a logged-out user.
  useEffect(() => {
    if (open) {
      setStep('email');
      setCode('');
      setBusy(false);
    }
  }, [open]);

  const localizeError = (key: string) => {
    switch (key) {
      case 'too_many':
        return tr(language, 'Trop de tentatives. Redemandez un code.', 'Too many attempts. Request a new code.', 'יותר מדי נסיונות. בקשו קוד חדש.');
      case 'expired':
        return tr(language, 'Code expiré. Redemandez-en un.', 'Code expired. Request a new one.', 'הקוד פג תוקף. בקשו קוד חדש.');
      default:
        return tr(language, 'Code incorrect.', 'Wrong code.', 'קוד שגוי.');
    }
  };

  const sendCode = async () => {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      toast.error(tr(language, 'Email invalide', 'Invalid email', 'דוא"ל לא תקין'));
      return;
    }
    setBusy(true);
    try {
      await requestCode(value);
      setStep('code');
      setCode('');
      toast.success(tr(language, 'Code envoyé ✓ Vérifiez vos emails.', 'Code sent ✓ Check your inbox.', 'הקוד נשלח ✓'));
    } catch {
      toast.error(tr(language, 'Échec de l’envoi. Réessayez.', 'Send failed. Try again.', 'השליחה נכשלה. נסו שוב.'));
    } finally {
      setBusy(false);
    }
  };

  const confirmCode = async (value: string) => {
    setBusy(true);
    try {
      await verifyCode(email.trim(), value);
      toast.success(tr(language, 'Connecté ✓ Votre progression est sauvegardée.', 'Logged in ✓ Your progress is saved.', 'מחובר ✓'));
      setOpen(false);
    } catch (e) {
      const key = e instanceof Error ? e.message : 'wrong_code';
      toast.error(localizeError(key));
      setCode('');
    } finally {
      setBusy(false);
    }
  };

  const onCodeChange = (value: string) => {
    setCode(value);
    if (value.length === 6 && !busy) confirmCode(value);
  };

  return (
    <>
      {/* sits just right of the settings gear (which is at left-3) — both top-left */}
      <div className="fixed top-3 left-14 z-30">
        <Button
          size="icon"
          variant="ghost"
          aria-label={tr(language, 'Mon compte', 'My account', 'החשבון שלי')}
          onClick={() => setOpen(true)}
          className={
            user
              ? 'h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-soft)] border border-primary/40'
              : 'h-10 w-10 rounded-full bg-background/90 backdrop-blur-md hover:bg-background shadow-[var(--shadow-soft)] border border-border'
          }
        >
          {user ? <UserCheck className="w-4 h-4" /> : <User className="w-4 h-4 text-primary" />}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-sm rounded-2xl"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* ---- Logged in ---- */}
          {ready && user ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-cormorant text-2xl flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  {tr(language, 'Mon compte', 'My account', 'החשבון שלי')}
                </DialogTitle>
                <DialogDescription className="font-assistant">
                  {tr(language, 'Votre progression est sauvegardée et synchronisée.', 'Your progress is saved and synced.', 'ההתקדמות שלך נשמרת ומסונכרנת.')}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-3 text-sm font-assistant">
                <User className="w-4 h-4 shrink-0 text-primary" />
                <span className="truncate" dir="ltr">{user.email}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => { logout(); setOpen(false); }}
                className="w-full gap-2 font-assistant"
              >
                <LogOut className="w-4 h-4" />
                {tr(language, 'Se déconnecter', 'Log out', 'התנתקות')}
              </Button>
            </>
          ) : step === 'email' ? (
            /* ---- Step 1: email ---- */
            <>
              <DialogHeader>
                <DialogTitle className="font-cormorant text-2xl">
                  {tr(language, 'Garder ma lecture', 'Save my reading', 'שמירת הקריאה שלי')}
                </DialogTitle>
                <DialogDescription className="font-assistant">
                  {tr(language, 'Recevez un code par email pour retrouver votre progression sur tous vos appareils.', 'Get a code by email to keep your progress across all your devices.', 'קבלו קוד במייל כדי לשמור על ההתקדמות בכל המכשירים.')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <Label className="text-xs font-cormorant font-semibold">Email</Label>
                <Input
                  type="email"
                  inputMode="email"
                  autoFocus
                  dir="ltr"
                  placeholder="email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                  className="h-11 rounded-xl font-assistant"
                />
                <Button onClick={sendCode} disabled={busy} className="w-full h-11 font-assistant">
                  {busy ? '…' : tr(language, 'Recevoir mon code', 'Get my code', 'קבלת הקוד')}
                </Button>
              </div>
            </>
          ) : (
            /* ---- Step 2: code ---- */
            <>
              <DialogHeader>
                <DialogTitle className="font-cormorant text-2xl flex items-center gap-2">
                  <MailCheck className="w-5 h-5 text-primary" />
                  {tr(language, 'Entrez le code', 'Enter the code', 'הזינו את הקוד')}
                </DialogTitle>
                <DialogDescription className="font-assistant" dir={isRtl ? 'rtl' : 'ltr'}>
                  {tr(language, 'Code à 6 chiffres envoyé à', 'We sent a 6-digit code to', 'שלחנו קוד בן 6 ספרות אל')}{' '}
                  <span dir="ltr" className="font-semibold text-foreground">{email}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-2">
                {/* OTP is digits → always LTR regardless of UI language */}
                <div dir="ltr">
                  <InputOTP maxLength={6} value={code} onChange={onCodeChange} disabled={busy} autoFocus>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} className="h-12 w-11 text-lg" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  onClick={() => code.length === 6 && confirmCode(code)}
                  disabled={busy || code.length !== 6}
                  className="w-full h-11 font-assistant"
                >
                  {busy ? '…' : tr(language, 'Se connecter', 'Log in', 'התחברות')}
                </Button>
                <div className="flex items-center justify-between w-full text-xs font-assistant">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {tr(language, 'Modifier l’email', 'Change email', 'שינוי דוא"ל')}
                  </button>
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={busy}
                    className="text-primary hover:underline disabled:opacity-50"
                  >
                    {tr(language, 'Renvoyer le code', 'Resend code', 'שליחה מחדש')}
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
